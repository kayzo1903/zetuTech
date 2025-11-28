// app/dashboard/complaints/page.tsx
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
import { Textarea } from "@/components/ui/textarea";
import { Search, Trash2, Eye, Reply } from "lucide-react";

interface Complaint {
  id: string;
  orderId: string;
  customerName: string;
  customerEmail: string;
  type: string;
  subject: string;
  description: string;
  status: "Open" | "In Progress" | "Resolved" | "Closed";
  priority: "Urgent" | "High" | "Medium" | "Low";
  createdAt: string;
  assignedTo: string;
}

const mockComplaints: Complaint[] = [
  {
    id: "COMP-001",
    orderId: "ORD-001",
    customerName: "David Brown",
    customerEmail: "david@example.com",
    type: "Delivery Issue",
    subject: "Late delivery",
    description: "My order was supposed to arrive on Jan 10th but it's still not here. This is very disappointing.",
    status: "Open",
    priority: "High",
    createdAt: "2024-01-15",
    assignedTo: "Support Team",
  },
  {
    id: "COMP-002",
    orderId: "ORD-002",
    customerName: "Emily Davis",
    customerEmail: "emily@example.com",
    type: "Product Quality",
    subject: "Defective product received",
    description: "The laptop I received has a cracked screen. I need an immediate replacement or refund.",
    status: "In Progress",
    priority: "Urgent",
    createdAt: "2024-01-14",
    assignedTo: "Quality Team",
  },
  {
    id: "COMP-003",
    orderId: "ORD-003",
    customerName: "Michael Chen",
    customerEmail: "michael@example.com",
    type: "Billing Issue",
    subject: "Incorrect charges",
    description: "I was charged twice for my order. Please refund the duplicate charge immediately.",
    status: "Resolved",
    priority: "Medium",
    createdAt: "2024-01-13",
    assignedTo: "Billing Team",
  },
  {
    id: "COMP-004",
    orderId: "ORD-004",
    customerName: "Lisa Rodriguez",
    customerEmail: "lisa@example.com",
    type: "Website Issue",
    subject: "Cannot track order",
    description: "The tracking link for my order is not working. I can't see where my package is.",
    status: "Open",
    priority: "Medium",
    createdAt: "2024-01-12",
    assignedTo: "IT Team",
  },
];

const COMPLAINT_STATUS = {
  Open: "bg-red-100 text-red-800",
  "In Progress": "bg-blue-100 text-blue-800",
  Resolved: "bg-green-100 text-green-800",
  Closed: "bg-gray-100 text-gray-800",
} as const;

const PRIORITY_STATUS = {
  Urgent: "bg-red-100 text-red-800",
  High: "bg-orange-100 text-orange-800",
  Medium: "bg-yellow-100 text-yellow-800",
  Low: "bg-gray-100 text-gray-800",
} as const;

export default function ComplaintsList() {
  const [complaints, setComplaints] = useState<Complaint[]>(mockComplaints);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");

  const filteredComplaints = complaints.filter((complaint) => {
    const matchesSearch = 
      complaint.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || complaint.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || complaint.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleDelete = (id: string) => {
    setComplaints(complaints.filter(complaint => complaint.id !== id));
  };

  const handleViewDetails = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setIsDetailOpen(true);
  };

  const handleReply = () => {
    console.log("Sending reply:", replyMessage);
    setReplyMessage("");
    setIsDetailOpen(false);
  };

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customer Complaints</h1>
          <p className="text-gray-600">Manage customer complaints and issues</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="rounded-lg border p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search complaints..."
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
              <SelectItem value="Open">Open</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Resolved">Resolved</SelectItem>
              <SelectItem value="Closed">Closed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="Urgent">Urgent</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Complaints Table */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Complaint Details</TableHead>
              <TableHead>Type & Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredComplaints.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  No complaints found matching your criteria
                </TableCell>
              </TableRow>
            ) : (
              filteredComplaints.map((complaint) => (
                <TableRow key={complaint.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{complaint.subject}</div>
                      <div className="text-sm text-gray-500">
                        Order: {complaint.orderId} • {complaint.customerName}
                      </div>
                      <div className="text-xs text-gray-400">{complaint.customerEmail}</div>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {complaint.description}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Badge variant="outline">{complaint.type}</Badge>
                      <div>
                        <Badge
                          variant="outline"
                          className={PRIORITY_STATUS[complaint.priority]}
                        >
                          {complaint.priority}
                        </Badge>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={COMPLAINT_STATUS[complaint.status]}
                    >
                      {complaint.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{complaint.assignedTo}</TableCell>
                  <TableCell>{complaint.createdAt}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleViewDetails(complaint)}
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
                              delete this complaint and remove it from the system.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(complaint.id)}
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
              {selectedComplaint?.id} - {selectedComplaint?.subject}
            </DialogTitle>
            <DialogDescription>
              Complaint Details
            </DialogDescription>
          </DialogHeader>

          {selectedComplaint && (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Complaint Details</h4>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <span className="text-sm text-gray-500">Customer:</span>
                    <div>{selectedComplaint.customerName}</div>
                    <div className="text-sm text-gray-500">{selectedComplaint.customerEmail}</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Order ID:</span>
                    <div>{selectedComplaint.orderId}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <span className="text-sm text-gray-500">Type:</span>
                    <Badge variant="outline">{selectedComplaint.type}</Badge>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Priority:</span>
                    <Badge
                      className={PRIORITY_STATUS[selectedComplaint.priority]}
                    >
                      {selectedComplaint.priority}
                    </Badge>
                  </div>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Description:</span>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-md mt-1">
                    {selectedComplaint.description}
                  </p>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Send Response</h4>
                <Textarea
                  placeholder="Type your response here..."
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  rows={4}
                />
                <Button className="mt-2" onClick={handleReply}>
                  <Reply className="w-4 h-4 mr-2" />
                  Send Response
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <p className="text-sm text-gray-600">
          Showing {filteredComplaints.length} of {complaints.length} complaints
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