import { Component, OnInit } from "@angular/core";

import { Router } from "@angular/router";
import { DataService } from "../services/data.service";
import { RestApiService } from "../services/rest-api.service";

@Component({
  selector: "app-address",
  templateUrl: "./address.component.html",
  styleUrls: ["./address.component.scss"]
})
export class AddressComponent implements OnInit {
  btnDisabled = false;
  currentAddress: any;

  constructor(
    private router: Router,
    private data: DataService,
    private rest: RestApiService
  ) {}

  async ngOnInit() {
    try {
      const data = await this.rest.get(
        "http://localhost:3030/api/accounts/address"
      );

      if (
        JSON.stringify(data["address"]) === "{}" &&
        this.data.message === ""
      ) {
        this.data.warning(
          "You have not entered your shipping address. Please enter your shipping address."
        );
      }
      console.log(data)
      this.currentAddress = data["address"];
    } catch (error) {
      this.data.error(error["message"]);
    }
  }

  async updateAddress() {
    try {
      console.log(this.currentAddress)
      const res = await this.rest.post(
        "http://localhost:3030/api/accounts/address",
        this.currentAddress
      );

      res["success"]
        ? (this.data.success(res["message"]), await this.data.getProfile())
        : this.data.error(res["message"]);
    } catch (error) {
      this.data.error(error["message"]);
    }

    this.btnDisabled = false;
  }
}
