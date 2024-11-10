import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { GetDataService } from '../../services/get-data/get-data.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

import { DatePipe } from '@angular/common';

import { SaveDataService } from '../../services/save-data/save-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UpdateDataService } from '../../services/update-data/update-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';

interface Contract{
  id: number;
  hotel: Hotel;
  startDate: string;
  endDate: string;
  markup: number;
}

interface RoomType {
  id: number;
  name: string;
  noOfRooms: number;
  maxAdults: number;
  price: number;
}

interface Hotel {
  id: number;
  name: string;
  roomTypes: RoomType[];
}

@Component({
  selector: 'app-contract-detail',
  templateUrl: './contract-detail.component.html',
  styleUrl: './contract-detail.component.css'
})
export class ContractDetailComponent implements OnInit{

  options: string[] = [];
  filteredOptons: string[] = [];
  public contractIdToUpdate!: number;
  public currentUrl!: string;
  public isUpdateActive: boolean = false;
  public contractToBeUpdated!: Contract;
  snackBarDuration : number = 3000; 

  getDataByIdUrl = "http://localhost:8081/api/v1/contract/get";
  updateDataUrl = "http://localhost:8081/api/v1/contract/update";

  formData: any = {
    hotel: {
      name: '',
      roomTypes: []
    },
    startDate: null,
    endDate: null
  };

  // constructor(private route: ActivatedRoute) {};

  getHotelDataUrl = "http://localhost:8081/api/v1/hotel/all";

  public contractDetailForm!: FormGroup;
  constructor(
    private getDataService: GetDataService, 
    private formBuilder: FormBuilder, 
    private datePipe: DatePipe,
    private saveDataService: SaveDataService,
    private changeDetector: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
    private updateDataService: UpdateDataService,
    private snackBar: MatSnackBar,
    ){}

  hotelNameControl = new FormControl();

  
  
  ngOnInit(): void {
    this.fetchData();
    this.initForm();
  }

  initForm() {

    this.currentUrl = this.router.url;

    console.log(this.currentUrl);

    this.contractDetailForm = this.formBuilder.group({
      hotelName : [''],
      startDate: [''],
      endDate: [''],
      markup: [''],
      roomTypes: this.formBuilder.array([])
    })

    this.contractDetailForm.get("hotelName")?.valueChanges.subscribe(response => {
        console.log(response);
        this.filterData(response);
    })

    this.route.params.subscribe(value => {
      this.contractIdToUpdate = value['id'];

      this.getDataService.fetchData(this.getDataByIdUrl+ "/" + this.contractIdToUpdate.toString()).subscribe(
        (response) => { 
          console.log(response);
          this.contractToBeUpdated = response;
          this.isUpdateActive = true;
          this.fillFormToUpdate(response);
        },
        (error) => {
          console.error("Error fetching dtaa: ", error);
        }
      );
    })
  }

  filterData(enteredData: string) {
    this.filteredOptons = this.options.filter(item =>{
    return item.toLowerCase().indexOf(enteredData.toLowerCase()) > -1
    })
  }

  fetchData(): void {
    this.getDataService.fetchData(this.getHotelDataUrl).subscribe(
      (response) => {
        // Extracting hotel names from the response
        this.options = response.map((hotel: Hotel) => hotel.name);
        this.filteredOptons = response.map((hotel: Hotel) => hotel.name);
        console.log(response);
      },
      (error) => {
        console.error("Error fetching data: ", error);
      }
    );
  }

  get roomTypes() {
    return this.contractDetailForm.get('roomTypes') as FormArray;
  }

  addRoomType() {
    const roomTypeFormGroup = this.formBuilder.group({
      roomTypeId: [''],
      roomTypeName: [''],
      maxAdults: [''],
      price: [''],
      noOfRooms: [''],
    });

    this.roomTypes.push(roomTypeFormGroup);

    // Update the JSON structure
    this.formData.hotel.roomTypes.push({
      name: '',
      noOfRooms: 1,
      maxAdults: 1,
      price: 0
    });
  }

  removeRoomType(index: number) {
    this.roomTypes.removeAt(index);
    this.formData.hotel.roomTypes.splice(index, 1);
  }

  onSubmit() {
    console.log(this.contractDetailForm.value);

    const contractDetails = this.contractDetailForm.value;

    const data = {
      "hotel": {
        "name": contractDetails.hotelName,
        "roomTypes": contractDetails.roomTypes.map((roomType: any) => {
          return {
            "name": roomType.roomTypeName,
            "noOfRooms": roomType.noOfRooms,
            "maxAdults": roomType.maxAdults,
            "price": roomType.price
          };
        })
      },
      "startDate": contractDetails.startDate,
      "endDate": contractDetails.endDate,
      "markup": contractDetails.markup,
      
      }

    console.log(data);

    const apiUrl = "http://localhost:8081/api/v1/contract/save"

    this.saveDataService.saveData(apiUrl, data).subscribe(
      (response) => {
          this.snackBar.open("Data saved successfully",'',{duration:this.snackBarDuration});
          console.log('Data submitted successfully:', response);
          this.contractDetailForm.reset();
          window.location.reload();
          // this.router.navigate(['save-contracts']);
          
      },
      (error) => {
          console.error('Error submitting data:', error);
          this.snackBar.open("Error: Unable to save data. Please try again later.",'Dismiss',{duration:this.snackBarDuration+2000});
      }
    );
  }

  fillFormToUpdate(contract: Contract) {
    this.contractDetailForm.setValue({
      hotelName: contract.hotel.name,
      startDate: contract.startDate,
      endDate: contract.endDate,
      markup: contract.markup,
      roomTypes: []
    });

    
    const roomTypesFormArray = this.contractDetailForm.get('roomTypes') as FormArray;

  
    contract.hotel.roomTypes.forEach(roomType => {

      roomTypesFormArray.push(this.formBuilder.group({
        roomTypeId: roomType.id,
        roomTypeName: roomType.name,
        noOfRooms: roomType.noOfRooms,
        maxAdults: roomType.maxAdults,
        price: roomType.price,
      }));
    });
  }

  update() {
    const updatedContractDetails = this.contractDetailForm.value;

    console.log(this.contractToBeUpdated);

    const data = {
      "id":this.contractToBeUpdated.id,
      "hotel": {
        "id": this.contractToBeUpdated.hotel.id,
        "name": updatedContractDetails.hotelName,
        "roomTypes": updatedContractDetails.roomTypes.map((roomType: any) => {
          return {
            "id": roomType.roomTypeId,
            "name": roomType.roomTypeName,
            "noOfRooms": roomType.noOfRooms,
            "maxAdults": roomType.maxAdults,
            "price": roomType.price
          };
        })
      },
      "startDate": updatedContractDetails.startDate,
      "endDate": updatedContractDetails.endDate,
      "markup": updatedContractDetails.markup
      }

      console.log(data);
      this.updateDataService.updateData(this.updateDataUrl, data).subscribe(
        (response) => { 
          console.log(response);
          this.router.navigate(['']);
          this.snackBar.open("Update successful! Your changes have been saved.",'',{duration:this.snackBarDuration});
        },
        (error) => {
          console.error("Error fetching dtaa: ", error);
          this.snackBar.open("Error: Your update couldn't be processed at the moment. Please try again.",'Dismiss',{duration:this.snackBarDuration+2000});
        }
      ); 
  }
}
