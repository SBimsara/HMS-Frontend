import { Component } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { GetDataService } from '../../services/get-data/get-data.service';
import { SaveDataService } from '../../services/save-data/save-data.service';

interface Contract{
  id: number;
  hotel: Hotel;
  startDate: string;
  endDate: string;
  markup: number;
}

interface Hotel{
  id: number;
  name: string;
  roomTypes: RoomType[];
}

interface RoomType{
  id: number;
  name: string;
  noOfRooms: number;
  maxAdults: number;
  price: number;
}

@Component({
  selector: 'app-search-contracts',
  templateUrl: './search-contracts.component.html',
  styleUrl: './search-contracts.component.css'
})
export class SearchContractsComponent {

  searchDataUrl = "http://localhost:8081/api/v1/contract/search";

  searchResults : [Contract[]] = [[]];


  public searchContractsForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder, 
    private getDataService: GetDataService, 
    private http: HttpClient,
    private saveDataService: SaveDataService,
    ) {}

  ngOnInit() {
    this.searchContractsForm = this.formBuilder.group({
      checkInDate: null,
      noOfNights: [''],
      requiredRooms: this.formBuilder.array([])
    });
  }

  get requiredRooms() {
    return this.searchContractsForm.get('requiredRooms') as FormArray;
  }

  addRequiredRoom() {
    const requiredRoomFromGroup = this.formBuilder.group({
      roomsRequired: [''],
      adultsPerRoom: ['']
    });

    this.requiredRooms.push(requiredRoomFromGroup);
  }

  removeRequiredRoom(index: number) {
    this.requiredRooms.removeAt(index);
  }

  search() {
    if (this.searchContractsForm.valid) {
      // Access the form values and create the desired data structure
      const formData = this.searchContractsForm.value;

      // Extracting 'roomsRequired' and 'adultsPerRoom' arrays
      const roomsRequired = formData.requiredRooms.map((room: any) => room.roomsRequired);
      const adultsPerRoom = formData.requiredRooms.map((room: any) => room.adultsPerRoom);

      // Create the desired data structure
      

      const checkInDate = formData.checkInDate;
      const noOfNights = formData.noOfNights;

    

      const result = {
        checkInDate,
        noOfNights,
        roomsRequired,
        adultsPerRoom,
      };
      console.log(result);
      this.saveDataService.saveData(this.searchDataUrl, result).subscribe(
        (response) => {
          this.searchResults = response;
          console.log(response);
        },
        (error) => {
          console.log("Error searching data: ",error);
        }
      );
    }
  }

}
