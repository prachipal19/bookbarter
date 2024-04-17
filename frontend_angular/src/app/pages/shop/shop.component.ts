import { Component, OnInit } from '@angular/core';
import { BookService } from '../book.service';
import { Book } from '../book.model';
@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html'
})
export class ShopComponent implements OnInit {
  books: Book[] = [];
  filteredBooks: Book[] = [];
  searchText: string = '';

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.bookService.getBooks().subscribe({
      next: (books) => {
        this.books = books;
        this.filterBooks(); // Initialize filteredBooks
      },
      error: (err) => console.error('Error fetching books: ', err)
    });
  }

  filterBooks(): void {
    if (this.searchText) {
      this.filteredBooks = this.books.filter(book =>
        book.title.toLowerCase().includes(this.searchText.toLowerCase())
      );
    } else {
      this.filteredBooks = this.books; 
    }
  }
}
