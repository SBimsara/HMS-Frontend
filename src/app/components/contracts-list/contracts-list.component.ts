import { Component, ViewChild, ViewChildren, QueryList, ChangeDetectorRef, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { GetDataService } from '../../services/get-data/get-data.service';
import { TemplateRef } from '@angular/core';
import { Router } from '@angular/router';


interface RoomType{
  id: number;
  name: string;
  noOfRooms: number;
  maxAdults: number;
  price: number;
}

@Component({
  selector: 'app-contracts-list',
  templateUrl: './contracts-list.component.html',
  styleUrl: './contracts-list.component.css',
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0',opacity: 0})),
      state('expanded', style({ height: '*',opacity: 1 })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ContractsListComponent implements OnInit {

  contractsList: any[] = [];
  dataSource: any;
  columnsToDisplay: string[] = ['id','hotelName','startDate','endDate','actions'];
  expandedElement !: RoomType|null;
  isToggleActive : boolean = false;

  getDataUrl = "http://localhost:8081/api/v1/contract/all";

  constructor(private getDataService: GetDataService, private router: Router) {

  }

  ngOnInit(): void {

    this.fetchData();

  }

  fetchData(): void {
    this.getDataService.fetchData(this.getDataUrl).subscribe(
      (response) => {
        this.contractsList = response;
        this.dataSource = new MatTableDataSource(this.contractsList);
      },
      (error) => {
        console.error("Error fetching dtaa: ", error);
      }
    );
  }

  toggle(element:any) {
    this.expandedElement = this.expandedElement===element ? null: element;
  }

  LoadSubTabledata() {

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

  toggleDetails() {
    this.isToggleActive = true;
  }
  
}