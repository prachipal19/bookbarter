import { Component, OnInit } from '@angular/core';
import { ListingService } from '../listing.services';
import { Book } from '../book.model';
import { AddBookComponent } from '../add-book/add-book.component'; // Import AddBookComponent

@Component({
  selector: 'app-mylistings',
  templateUrl: './mylistings.component.html',
  styleUrls: ['./mylistings.component.css']
})
export class MylistingsComponent implements OnInit {
  listings: Book[] = [];
  selectedBook: Book | null = null;
  showDeleteConfirmation: boolean = false;
  showUpdateConfirmation: boolean = false;
  showAddBook: boolean = false;

  constructor(private listingService: ListingService) { }

  ngOnInit(): void {
    this.fetchUserListings();
  }

  fetchUserListings() {
    const token = localStorage.getItem('authToken');
    if (token) {
      this.listingService.getUserListings(token).subscribe(listings => {
        this.listings = listings;
      });
    } else {
      console.error('Authentication token is missing. Please log in.');
    }
  }

  handleUpdateListing(book: Book) {
    // If the same book is clicked again, close the form
    if (this.selectedBook === book) {
      this.selectedBook = null;
      this.showAddBook = false; // Close the form
    } else {
      // Otherwise, open the update form for the selected book
      this.selectedBook = book;
      this.openUpdateBookForm(book);
    }
  }
  

  handleDeleteListing(isbn: string) {
    const token = localStorage.getItem('authToken');
    if (token) {
      this.listingService.deleteUserListing(isbn, token).subscribe(() => {
        this.listings = this.listings.filter(listing => listing.ISBN !== isbn);
        this.showDeleteConfirmation = true;
      }, error => {
        console.error('Error deleting listing:', error);
      });
    }
  }

  handleCloseForm() {
    this.selectedBook = null;
    this.fetchUserListings();
    if (this.showAddBook) {
      this.showUpdateConfirmation = true; 
    }
  }
  
  toggleAddBookForm() {
    this.showAddBook = !this.showAddBook;
  }

  openAddBookForm() {
    this.selectedBook = null;
    this.showAddBook = true;
  }

  openUpdateBookForm(book: Book) {
    this.selectedBook = book;
    this.showAddBook = true;
  }
}
