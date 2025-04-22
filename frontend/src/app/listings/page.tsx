"use client";
import React, { useState, useEffect, SetStateAction } from "react";
import { FaShoppingCart, FaExchangeAlt } from "react-icons/fa";
import Layout from "../components/Layout";
import BookCard from "@/src/app/components/BookCard";

interface Listing {
  _id: SetStateAction<null>;
  userId: string;
  ISBN: string;
  img: string;
  title: string;
  author: string;
  inventory: number;
  category: string;
  isExchange: boolean;
}
interface User {
  _id: string;
  email: string;
  // any other fields you expect
}
const listingsPerPage = 18;

const Listings = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterExchange, setFilterExchange] = useState(false);
  const [showRequestPopup, setShowRequestPopup] = useState(false);
  const [selectedListingUser, setSelectedListingUser] = useState<User | null>(
    null
  );

  const [showAddToCartPopup, setShowAddToCartPopup] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState(null);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await fetch("/api/listings/index");
        const data = await response.json();
        setListings(data);
      } catch (error) {
        console.error("Error fetching listings:", error);
      }
    };

    fetchListings();
  }, []);

  const filteredListings = listings.filter((listing) => {
    if (filterExchange && !listing.isExchange) return false;
    if (searchTerm === "") return true;
    return listing.title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const indexOfLastListing = currentPage * listingsPerPage;
  const indexOfFirstListing = indexOfLastListing - listingsPerPage;
  const currentListings = filteredListings.slice(
    indexOfFirstListing,
    indexOfLastListing
  );

  const nextPage = () => setCurrentPage(currentPage + 1);
  const prevPage = () => setCurrentPage(currentPage - 1);

  const fetchUserDetails = async (userId: string) => {
    try {
      const response = await fetch(`/api/user/${userId}`);
      const data = await response.json();
      setSelectedListingUser(data);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };
  const handleExchangeClick = async (
    userId: string,
    bookId: React.SetStateAction<null>
  ) => {
    try {
      await fetchUserDetails(userId);
      setShowRequestPopup(true);
      setSelectedBookId(bookId);
      console.log(bookId);
    } catch (error) {
      console.error("Error handling exchange click:", error);
    }
  };

  const handleRequestClick = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }

      await fetch("/api/exchange/send", {
        method: "POST",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          receiverEmail: selectedListingUser?.email,
          receiverId: selectedListingUser?._id,
          bookId: selectedBookId,
        }),
      });

      console.log(selectedBookId);
      setShowRequestPopup(false);
    } catch (error) {
      console.error("Error sending exchange request:", error);
    }
  };

  const handleAddToCartClick = (userId: string) => {
    fetchUserDetails(userId);
    setShowAddToCartPopup(true);
  };

  return (
    <Layout>
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px" }}>
        <div>
          <div
            style={{
              backgroundImage: "url('/images/about.jpg')",
              backgroundRepeat: "no-repeat", // Prevent tiling
              backgroundSize: "cover", // Fit image nicely
              backgroundPosition: "center", // Center the image
              padding: "16px",
              borderRadius: "4px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h3
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                marginBottom: "16px",
                textAlign: "center",
              }}
            >
              Listings
            </h3>
            <input
              type="text"
              placeholder="Search by book name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ marginBottom: "16px", padding: "8px", width: "100%" }}
            />
            <label>
              <input
                type="checkbox"
                checked={filterExchange}
                onChange={() => setFilterExchange(!filterExchange)}
              />
              Show Exchange Listings
            </label>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: "16px",
              }}
            >
              {currentListings.map((listing, index) => (
                <div
                  key={index}
                  style={{
                    position: "relative",
                    background: "#f4f4f4",
                    padding: "16px",
                    borderRadius: "4px",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                    overflow: "hidden",
                  }}
                >
                  <BookCard item={listing} />
                  {listing.isExchange ? (
                    <button
                      onClick={() =>
                        handleExchangeClick(listing.userId, listing._id)
                      } // Pass bookId to handleExchangeClick
                      style={{
                        position: "absolute",
                        bottom: "8px",
                        right: "8px",
                        background: "none",
                        border: "1px solid #3182ce",
                        borderRadius: "50%",
                        padding: "10px",
                        cursor: "pointer",
                      }}
                      aria-label="Send Exchange Request"
                    >
                      <div
                        style={{
                          background: "white",
                          borderRadius: "50%",
                          padding: "4px",
                        }}
                      >
                        <FaExchangeAlt
                          style={{ fontSize: "1.2rem", color: "#3182ce" }}
                        />
                      </div>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleAddToCartClick(listing.userId)}
                      style={{
                        position: "absolute",
                        bottom: "8px",
                        right: "8px",
                        background: "none",
                        border: "1px solid #3182ce",
                        borderRadius: "50%",
                        padding: "10px",
                        cursor: "pointer",
                      }}
                      aria-label="Add to Cart"
                    >
                      <div
                        style={{
                          background: "white",
                          borderRadius: "50%",
                          padding: "4px",
                        }}
                      >
                        <FaShoppingCart
                          style={{ fontSize: "1.2rem", color: "#3182ce" }}
                        />
                      </div>
                    </button>
                  )}
                </div>
              ))}
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "16px",
              }}
            >
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                style={{
                  background: "#3182ce",
                  color: "white",
                  padding: "8px 12px",
                  border: "none",
                  borderRadius: "4px",
                  margin: "0 4px",
                  cursor: "pointer",
                }}
              >
                Previous
              </button>
              <button
                onClick={nextPage}
                disabled={currentListings.length < listingsPerPage}
                style={{
                  background: "#3182ce",
                  color: "white",
                  padding: "8px 12px",
                  border: "none",
                  borderRadius: "4px",
                  margin: "0 4px",
                  cursor: "pointer",
                }}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
      {showRequestPopup && selectedListingUser && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",
            background: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: "9999",
          }}
        >
          <div
            style={{
              background: "white",
              padding: "24px",
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              maxWidth: "400px",
              width: "90%",
            }}
          >
            <p
              style={{
                fontSize: "18px",
                marginBottom: "16px",
                textAlign: "center",
              }}
            >
              Send book exchange request to <b>{selectedListingUser.email}</b>
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "24px",
              }}
            >
              <button
                onClick={() => setShowRequestPopup(false)}
                style={{
                  background: "#ccc",
                  color: "black",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  marginRight: "12px",
                  fontWeight: "bold",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleRequestClick}
                style={{
                  background: "#3182ce",
                  color: "white",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}
      {showAddToCartPopup && selectedListingUser && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",
            background: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: "9999",
          }}
        >
          <div
            style={{
              background: "white",
              padding: "24px",
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              maxWidth: "400px",
              width: "90%",
            }}
          >
            <p
              style={{
                fontSize: "18px",
                marginBottom: "16px",
                textAlign: "center",
              }}
            >
              Add book to cart
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "24px",
              }}
            >
              <button
                onClick={() => setShowAddToCartPopup(false)}
                style={{
                  background: "#ccc",
                  color: "black",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  marginRight: "12px",
                  fontWeight: "bold",
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => console.log("Added to Cart")}
                style={{
                  background: "#3182ce",
                  color: "white",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Listings;
