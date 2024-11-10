import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { GetDataService } from '../../services/get-data/get-data.service';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { DeleteDataService } from '../../services/delete-data/delete-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

interface Contract{
  id: number;
  hotel: Hotel;
  startDate: string;
  endDate: string;
}

interface Hotel{
  id: number;
  name: string;
  roomTypes?: RoomType[] | MatTableDataSource<RoomType>;
}

interface RoomType{
  id: number;
  name: string;
  noOfRooms: number;
  maxAdults: number;
  price: number;
}

@Component({
  selector: 'app-contracts',
  templateUrl: './contracts.component.html',
  styleUrl: './contracts.component.css',
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0',opacity: 0})),
      state('expanded', style({ height: '*',opacity: 1 })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class ContractsComponent implements OnInit{

  data:Contract[] = [];
  expandedElement !: RoomType|null;
  dataSource = new MatTableDataSource<Contract>();
  nestedTableDataSource = new MatTableDataSource<RoomType>();


  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = [
  'id',
  'hotelName',
  'startDate',
  'endDate',
  'actions'
  ];

  nestedDisplayedColumns: string[] = [
    'roomTypeName',
    'noOfRooms',
    'maxAdults',
    'price',
  ];

  getDataUrl = "http://localhost:8081/api/v1/contract/all";
  getDataByIdUrl = "http://localhost:8081/api/v1/contract/get";
  getPaginatedData = "http://localhost:8081/api/v1/contract/get/";

  constructor(private getDataService: GetDataService, private router: Router, private deleteDataService: DeleteDataService, private snackBar: MatSnackBar){}

  ngOnInit(): void {
    this.fetchData();

  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  fetchData(): void {
    this.getDataService.fetchData(this.getDataUrl).subscribe(
      (response) => {
        this.data = response;
        this.dataSource.data = this.data;

        this.data.forEach(contract => {
          if (contract.hotel.roomTypes instanceof MatTableDataSource) {
            this.nestedTableDataSource = contract.hotel.roomTypes;
          } else if (Array.isArray(contract.hotel.roomTypes)) {
            this.nestedTableDataSource.data = contract.hotel.roomTypes;
          }
        });
        console.log(response);
        console.log(this.nestedTableDataSource);
        console.log(this.dataSource);
      },
      (error) => {
        console.error("Error fetching dtaa: ", error);
      }
    );
  }

  pageChanged(event: PageEvent) {

  }

  loadContract(id: number) {
    console.log(id);
    this.router.navigate(["update-contract", id]);



    // this.getDataService.fetchData(this.getDataByIdUrl+ "/" + id.toString()).subscribe(
    //   (response) => { 
    //     console.log(response);
    //   },
    //   (error) => {
    //     console.error("Error fetching dtaa: ", error);
    //   }
    // );
  }

  deleteContract(id:number) {
    console.log(id);

    this.deleteDataService.DeleteData("http://localhost:8081/api/v1/hotel/delete",id).subscribe(
      (response) => {
        this.snackBar.open("Successfully deleted data.","",{duration:3000});
        window.location.reload();
      },
      (error) => {
        console.log("error deleteting data: ",error);
        this.snackBar.open("Error: Failed to delete data.",'',{duration:6000});
      }  
    )
  }

  toggle(element:any) {
    this.expandedElement = this.expandedElement===element ? null: element;
  }


}
