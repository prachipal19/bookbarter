// listings.component.ts
import { Component, OnInit } from '@angular/core';
import { ListingsService } from '../listings.service';

@Component({
  selector: 'app-listings',
  templateUrl: './listings.component.html',
  styleUrls: ['./listings.component.css']
})
export class ListingsComponent implements OnInit {
  listings: any[] = [];
  currentPage = 1;
  searchTerm = '';
  filterExchange = false;
  showRequestPopup = false;
  selectedListingUser: any = null;
  selectedBookId: any = null;

  constructor(private listingsService: ListingsService) { }

  ngOnInit(): void {
    this.fetchListings();
  }

  fetchListings(filterExchange: boolean = false): void {
    this.listingsService.getAllListings().subscribe(
      (response) => {
        if (filterExchange) {
          this.listings = response.filter(listing => listing.isExchange);
        } else {
          this.listings = response;
        }
      },
      (error) => {
        console.error('Error fetching listings:', error);
      }
    );
  }

  filterListings(): void {
    if (!this.searchTerm.trim()) {
      this.fetchListings();
    } else {
      this.listingsService.getAllListings().subscribe(
        (response) => {
          this.listings = response.filter(listing =>
            listing.title.toLowerCase().includes(this.searchTerm.toLowerCase())
          );
        },
        (error) => {
          console.error('Error fetching listings:', error);
        }
      );
    }
  }

  nextPage(): void {
    this.currentPage++;
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  fetchUserDetails(userId: string): void {
    this.listingsService.fetchUserDetails(userId).subscribe(
      (userData) => {
        this.selectedListingUser = userData;
      },
      (error) => {
        console.error('Error fetching user details:', error);
      }
    );
  }

  handleExchangeClick(userId: string, bookId: string): void {
    this.fetchUserDetails(userId);
    this.selectedBookId = bookId;
    this.showRequestPopup = true;
  }

  handleRequestClick(): void {
    const token = localStorage.getItem('authToken');
    if (!token || !this.selectedListingUser || !this.selectedBookId) {
      return;
    }
  
    this.listingsService.sendExchangeRequest(this.selectedListingUser.email, this.selectedListingUser._id, this.selectedBookId, token).subscribe(
      () => {
        console.log('Exchange request sent successfully');
        window.alert('Exchange request sent successfully');
        this.showRequestPopup = false;
      },
      (error) => {
        console.error('Error sending exchange request:', error);
        window.alert('Error sending exchange request');
      }
    );
  }
}