import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import Utils from '../../utils';
import { environment } from '../../../environments/environment';

import { AuthenticationService } from '../../services/authentication.service';
import { RoomService } from '../../services/room.service';

@Component({
  selector: 'student-login',
  templateUrl: './student-login.component.html',
  styleUrls: ['./student-login.component.scss'],
  providers: [ RoomService ]
})
export class StudentLoginComponent implements OnInit {

  private name: string;
  private roomId: string;
  private roomsName: Array<string> = [ ];
  private serverMsg: string = ''; // Message received from the server
  private roomIdPatrn = /^([A-Z]|[a-z]|[0-9]|-|_|\s)+$/; // Regex for uppercase validation

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService,
    private roomService: RoomService
  ) { }

  ngOnInit(): void {
    this.roomService.getAllRoomsName().subscribe((roomsName: Array<string>) => {
      this.roomsName = roomsName;
    });
  }

  joinSession(): void {
    this.serverMsg = '';

    if (Utils.isEmpty(this.name) || Utils.isEmpty(this.roomId)) {
      return;
    }

    let body = {
      roomName: this.roomId,
      userName: this.name
    };

    this.http.post(`${environment.api}/rooms/connect/student`, body).subscribe(
      (data: any) => {
        if(data.success) {
          this.authService.authenticateStudent(data.token);
        } else {
          this.serverMsg = data['message'];
        }
      }
    );
  }
}
