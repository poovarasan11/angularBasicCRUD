import { ApiService } from './../services/api.service';
import { EmployeeModel } from './employee-dash-board.model';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { emailValidator } from '../email-validator.directive';
import { Subscriber } from 'rxjs';
import { HttpClient } from '@angular/common/http';
declare var $: any;

@Component({
  selector: 'app-employee-dashboard',
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.css']
})
export class EmployeeDashboardComponent {
  formValue !: FormGroup;
  employeeModelObj: EmployeeModel = new EmployeeModel();
  employeeData !: any;
  showAdd!: boolean;
  showUpdate!: boolean;
  user: EmployeeModel;
  dtOptions: DataTables.Settings = {};
  submitted = false;
  service: any;


  // cformsubmit: boolean=false; 



  // dtOptions:any={}
  // dtTrigger1: Subject<any> = new Subject<any>();


  constructor(private formbuilder: FormBuilder, private api: ApiService, private http: HttpClient) {
    this.user = {} as EmployeeModel;
  }


  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      processing: true
    };

    this.formValue = new FormGroup({
      firstName: new FormControl(this.user.firstName, [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(250),
      ]),
      lastName: new FormControl(this.user.lastName, [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(50),
      ]),
      email: new FormControl(this.user.email, [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(250),
        emailValidator(),
      ]),
      mobile: new FormControl(this.user.mobile, [
        Validators.required,
        Validators.pattern("^[0-9]*$"),
        Validators.minLength(10),
        Validators.maxLength(10),
      ]),
      salary: new FormControl(this.user.salary, [
        Validators.required,

      ]),

      image: new FormControl(this.user.image, [
        Validators.required,

      ]),
    })
    this.getAllEmployee();
  }
  // this.formValue = this.formbuilder.group({
  //   firstName: [''],
  //   lastName: [''],
  //   email: [''],
  //   mobile: [''],
  //   salary: ['']


  // })
  // this.getAllEmployee();
  // }
  clickAddEmployee() {
    this.formValue.reset();
    this.showAdd = true;
    this.showUpdate = false;
  }
  postEmployeeDetails() {

    // if (formValue!=null) {


    // } else {
    //   console.log("Fill the all detials");
    // }

    this.employeeModelObj.firstName = this.formValue.value.firstName;
    this.employeeModelObj.lastName = this.formValue.value.lastName;
    this.employeeModelObj.email = this.formValue.value.email;
    this.employeeModelObj.mobile = this.formValue.value.mobile;
    this.employeeModelObj.salary = this.formValue.value.salary;
    this.employeeModelObj.image = this.formValue.value.image;
    this.api.postEmploye(this.employeeModelObj,)
      .subscribe((res: any,) => {
        console.log("==============", res);
        alert("Employee Added Successfully")
        let ref = document.getElementById('cancel')
        ref?.click();
        this.formValue.reset();
        this.getAllEmployee();
      }, err => {
        alert("Something Went wrong")
        // alert("Please Enter The Mandatory Fields")  ;

        console.log("++++++++++", err);

      })

  }




  getAllEmployee() {
    this.api.getEmployee()
      .subscribe(res => {
        // this.recovery();
        // this.dataTable("searchAllDataList");
        this.employeeData = res;
      })
  }
  deleteEmployee(row: any) {
    if (confirm('Are you sure to delete employee data ?'))
      this.api.deleteEmployee(row.id).subscribe(res => {
        alert("Sucessfuly employee data deleted..!")
        this.getAllEmployee()
      })
  }

  onEdit(row: any) {
    this.showAdd = false;
    this.showUpdate = true;
    this.employeeModelObj.id = row.id;
    this.formValue.controls['firstName'].setValue(row.firstName)
    this.formValue.controls['lastName'].setValue(row.lastName)
    this.formValue.controls['email'].setValue(row.email)
    this.formValue.controls['mobile'].setValue(row.mobile)
    this.formValue.controls['salary'].setValue(row.salary)


  }
  updateEmployeeDetails() {

    this.employeeModelObj.firstName = this.formValue.value.firstName;
    this.employeeModelObj.lastName = this.formValue.value.lastName;
    this.employeeModelObj.email = this.formValue.value.email;
    this.employeeModelObj.mobile = this.formValue.value.mobile;
    this.employeeModelObj.salary = this.formValue.value.salary;
    this.api.updateEmployee(this.employeeModelObj, this.employeeModelObj.id)
      .subscribe(res => {
        alert('Update Sucessfuly');
        let ref = document.getElementById('cancel')
        ref?.click();
        this.formValue.reset();

        this.getAllEmployee();
      })
  }

  get firstName() {
    return this.formValue.get('firstName')!;
  }
  get lastName() {
    return this.formValue.get('lastName')!;
  }
  get email() {
    return this.formValue.get('email')!;
  }

  // get c(){
  //   return this.CatFrom.controls;
  // }

  omit_special_char_spchar(event: { charCode: any; }) {
    var k;
    k = event.charCode;
    return ((k >= 48 && k <= 57));
  };

  lettersOnly(event: { key: string; }): boolean {
    let patt = /^([A-Za-z])$/;
    let result = patt.test(event.key);
    return result;
  }

  numbersOnly(event: { key: string; }): boolean {
    // let patt = /^([A-Za-z])$/;
    let patt = /^[0-9]\d*$/;
    let result = patt.test(event.key);
    return result;
  }


  onSubmit() {

    this.submitted = true;

    if (this.formValue.invalid) {
      return;
    } else {
      this.service.save(this.formValue.value).subscribe((response: { status: string; }) => {
        // debugger
        console.log(response);
        if (response.status == 'success') {
          this.formValue.reset;
          this.submitted = false;
          alert('You Submitted SuccessFully');
          let formData = new FormData();
        }

        else {
          alert('data is invalid');
        }
      });
    }

    console.warn(this.formValue.value);
  }
  // }
  name: string = ""
  file: any;
  getName(name: string) {
    this.name = name;
  }
  getFile(event: any) {
    this.file = event.target.files[0];
    console.log("file::", this.file)
  }
  submitData() {
    // create form data object
    let formData = new FormData();
    formData.set("name", this.name);
    formData.set("file", this.file);

    // submit api

    this.http.post('http://localhost:3000/posts', formData).subscribe((response) => { })
  }
}
