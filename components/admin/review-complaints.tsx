// app/dashboard/reviews/page.tsx
"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, Star, Trash2, Eye } from "lucide-react";

interface Review {
  id: string;
  productName: string;
  customerName: string;
  customerEmail: string;
  rating: number;
  comment: string;
  status: "Published" | "Pending" | "Rejected";
  createdAt: string;
  helpful: number;
  productImage: string;
}

const mockReviews: Review[] = [
  {
    id: "REV-001",
    productName: "Dell XPS 13",
    customerName: "John Doe",
    customerEmail: "john@example.com",
    rating: 5,
    comment: "Excellent laptop! Fast performance and great battery life. Highly recommended!",
    status: "Published",
    createdAt: "2024-01-15",
    helpful: 12,
    productImage: "/api/placeholder/60/60?text=Dell+XPS",
  },
  {
    id: "REV-002",
    productName: "iPhone 15 Pro",
    customerName: "Jane Smith",
    customerEmail: "jane@example.com",
    rating: 4,
    comment: "Great phone but the battery could be better. Camera quality is amazing though.",
    status: "Published",
    createdAt: "2024-01-14",
    helpful: 8,
    productImage: "/api/placeholder/60/60?text=iPhone",
  },
  {
    id: "REV-003",
    productName: "Samsung Galaxy S23",
    customerName: "Mike Johnson",
    customerEmail: "mike@example.com",
    rating: 2,
    comment: "Disappointed with the performance. Phone gets hot during normal use.",
    status: "Pending",
    createdAt: "2024-01-13",
    helpful: 3,
    productImage: "/api/placeholder/60/60?text=Galaxy",
  },
  {
    id: "REV-004",
    productName: "MacBook Air M2",
    customerName: "Sarah Wilson",
    customerEmail: "sarah@example.com",
    rating: 5,
    comment: "Absolutely love this laptop! Super fast and the build quality is exceptional.",
    status: "Published",
    createdAt: "2024-01-12",
    helpful: 15,
    productImage: "/api/placeholder/60/60?text=MacBook",
  },
];

const REVIEW_STATUS = {
  Published: "bg-green-100 text-green-800",
  Pending: "bg-yellow-100 text-yellow-800",
  Rejected: "bg-red-100 text-red-800",
} as const;

export default function ReviewsList() {
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch = 
      review.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || review.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleDelete = (id: string) => {
    setReviews(reviews.filter(review => review.id !== id));
  };

  const handleViewDetails = (review: Review) => {
    setSelectedReview(review);
    setIsDetailOpen(true);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
        <span className="ml-2 text-sm text-gray-600">({rating}/5)</span>
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Product Reviews</h1>
          <p className="text-gray-600">Manage customer product reviews and ratings</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="rounded-lg border p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search reviews..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Published">Published</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product & Customer</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Review</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReviews.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  No reviews found matching your criteria
                </TableCell>
              </TableRow>
            ) : (
              filteredReviews.map((review) => (
                <TableRow key={review.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-md bg-gray-200 flex items-center justify-center">
                        <span className="text-xs text-gray-600">Product</span>
                      </div>
                      <div>
                        <div className="font-medium">{review.productName}</div>
                        <div className="text-sm text-gray-500">
                          by {review.customerName}
                        </div>
                        <div className="text-xs text-gray-400">{review.customerEmail}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{renderStars(review.rating)}</TableCell>
                  <TableCell>
                    <div className="max-w-xs">
                      <p className="text-sm line-clamp-2">{review.comment}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                        <ThumbsUpIcon className="w-3 h-3" />
                        {review.helpful} people found this helpful
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={REVIEW_STATUS[review.status]}
                    >
                      {review.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{review.createdAt}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleViewDetails(review)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently
                              delete this review and remove it from the system.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(review.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedReview?.id} - {selectedReview?.productName}
            </DialogTitle>
            <DialogDescription>
              Review Details
            </DialogDescription>
          </DialogHeader>

          {selectedReview && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-md bg-gray-200 flex items-center justify-center">
                  <span className="text-sm text-gray-600">Product</span>
                </div>
                <div>
                  <div className="font-medium">{selectedReview.productName}</div>
                  <div className="text-sm text-gray-500">
                    by {selectedReview.customerName} ({selectedReview.customerEmail})
                  </div>
                  {renderStars(selectedReview.rating)}
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Review Comment</h4>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-md">
                  {selectedReview.comment}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-500">Status:</span>
                  <Badge className={REVIEW_STATUS[selectedReview.status]}>
                    {selectedReview.status}
                  </Badge>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Helpful:</span>
                  <span className="ml-2">{selectedReview.helpful} people</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <p className="text-sm text-gray-600">
          Showing {filteredReviews.length} of {reviews.length} reviews
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

function ThumbsUpIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
    </svg>
  );
}