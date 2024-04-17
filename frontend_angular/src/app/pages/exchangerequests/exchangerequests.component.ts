import { Component, OnInit } from '@angular/core';
import { ExchangeRequest } from '../exchangerequests.model';
import { Book } from '../book.model';
import { ExchangeRequestsService } from '../exchange-requests.service';

@Component({
  selector: 'app-exchange-requests',
  templateUrl: './exchangerequests.component.html',
  styleUrls: ['./exchangerequests.component.css']
})
export class ExchangerequestsComponent implements OnInit {
  incomingRequests: ExchangeRequest[] = [];
  outgoingRequests: ExchangeRequest[] = [];
  error: string | null = null;
  selectedBook: Book | null = null;
  isBookSelected: boolean = false;
  selectedRequestId: string = '';

  constructor(private exchangeRequestsService: ExchangeRequestsService) { }

  ngOnInit(): void {
    this.fetchExchangeRequests();
  }

  fetchExchangeRequests(): void {
    this.exchangeRequestsService.getExchangeRequests().subscribe(
      (data: any) => {
        this.incomingRequests = data.incomingRequests;
        this.outgoingRequests = data.outgoingRequests;
      },
      (error: any) => {
        console.error('Error fetching exchange requests:', error);
        this.error = 'Failed to fetch exchange requests';
      }
    );
  }

  handleAcceptReject(action: string): void {
    if (!this.selectedBook) {
      console.error('No book selected.');
      return;
    }
    this.exchangeRequestsService.updateExchangeRequestStatus(this.selectedRequestId, action, this.selectedBook._id)
      .subscribe(
        () => {
          this.fetchExchangeRequests();
          this.selectedBook = null;
          this.isBookSelected = false;
          this.selectedRequestId = '';
        },
        (error: any) => {
          console.error(`Error ${action === 'accepted' ? 'accepting' : 'rejecting'} exchange request:`, error);
          this.error = `Failed to ${action === 'accepted' ? 'accepted' : 'rejected'} exchange request`;
        }
      );
  }

  handleBookSelectionChange(requestId: string, book: Book): void {
    this.selectedBook = book;
    this.isBookSelected = true;
    this.selectedRequestId = requestId;
  }
}
