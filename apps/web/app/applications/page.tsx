"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function ApplicationFormPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">New Application</h1>
          <p className="mt-1 text-sm text-muted-foreground">Fill in the applicant details</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm">Save Draft</Button>
          <Button size="sm">Submit Application</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Information About Applicant</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>First Name</Label>
              <Input placeholder="Enter first name" />
            </div>
            <div className="space-y-2">
              <Label>Last Name</Label>
              <Input placeholder="Enter last name" />
            </div>
            <div className="space-y-2">
              <Label>Middle Name</Label>
              <Input placeholder="Enter middle name" />
            </div>
            <div className="space-y-2">
              <Label>Date of Birth</Label>
              <Input type="date" />
            </div>
            <div className="space-y-2">
              <Label>City of Birth</Label>
              <Input placeholder="Enter city" />
            </div>
            <div className="space-y-2">
              <Label>State of Birth</Label>
              <Input placeholder="Enter state" />
            </div>
            <div className="space-y-2">
              <Label>Country of Birth</Label>
              <Input placeholder="Enter country" />
            </div>
            <div className="space-y-2">
              <Label>Citizenship</Label>
              <Input placeholder="Enter citizenship" />
            </div>
            <div className="space-y-2">
              <Label>Marital Status</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single</SelectItem>
                  <SelectItem value="married">Married</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Gender</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <Label>Permanent Street Address</Label>
              <Input placeholder="Enter street address" />
            </div>
            <div className="space-y-2">
              <Label>City</Label>
              <Input placeholder="Enter city" />
            </div>
            <div className="space-y-2">
              <Label>State</Label>
              <Input placeholder="Enter state" />
            </div>
            <div className="space-y-2">
              <Label>Zip / Postal Code</Label>
              <Input placeholder="Enter zip code" />
            </div>
            <div className="space-y-2">
              <Label>Country</Label>
              <Input placeholder="Enter country" />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" placeholder="Enter email" />
            </div>
            <div className="space-y-2">
              <Label>Location of Embassy for Visa</Label>
              <Input placeholder="Enter embassy location" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Additional Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Language 1</Label>
              <Input placeholder="Enter language" />
            </div>
            <div className="space-y-2">
              <Label>Speaking Ability</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Reading Ability</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Writing Ability</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Language 2</Label>
              <Input placeholder="Enter language" />
            </div>
            <div className="space-y-2">
              <Label>Speaking Ability</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Reading Ability</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Writing Ability</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Other Languages</Label>
            <textarea
              className="w-full rounded-lg border border-border bg-input px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-[#F0A030]/50 focus:ring-1 focus:ring-[#F0A030]/20 resize-none"
              rows={3}
              placeholder="List other languages..."
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Program Selection</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { value: "pre-medical", label: "Pre-medical course — 10 months" },
              { value: "general-medicine", label: "\"General Medicine\" (MD, MBBS equivalent) — 6 years" },
              { value: "dentistry", label: "\"Dentistry\" (MD, MBBS equivalent) — 5 years" },
              { value: "post-graduate", label: "Post-graduate course (indicate):" },
            ].map((program) => (
              <label
                key={program.value}
                className="flex cursor-pointer items-center gap-3 rounded-lg border border-border px-4 py-3 transition-colors hover:border-[#F0A030]/50 has-data-checked:border-[#F0A030] has-data-checked:bg-[#F0A030]/5"
              >
                <input
                  type="radio"
                  name="program"
                  value={program.value}
                  className="size-4 accent-[#F0A030]"
                />
                <span className="text-sm text-foreground">{program.label}</span>
              </label>
            ))}
            <div className="ml-9">
              <Input placeholder="Specify post-graduate course" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Signature & Date</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Signature</Label>
              <Input placeholder="Type your full name as signature" />
            </div>
            <div className="space-y-2">
              <Label>Date</Label>
              <Input type="date" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
