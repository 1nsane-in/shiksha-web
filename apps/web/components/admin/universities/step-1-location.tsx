"use client";

import { Button } from "@repo/ui";
import { Input } from "@repo/ui";
import { Label } from "@repo/ui";
import { Textarea } from "@repo/ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui";
import { Country, State, City } from "country-state-city";
import { SearchableSelect } from "@/components/ui/searchable-select";
import type { WizardStep1Props } from "./new-page.types";

export function LocationStep({
  formData,
  formErrors,
  onFieldUpdate,
  onSetFormErrors,
  locationCodes,
  onSetLocationCodes,
}: WizardStep1Props) {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Location */}
      <div className="rounded-lg border border-border/60 bg-card p-3 space-y-4 sm:p-4">
        <h4 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">Location</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div data-error-field="location.country">
            <Label>Country *</Label>
            <SearchableSelect
              options={Country.getAllCountries().map((c) => ({ label: c.name, value: c.isoCode }))}
              value={locationCodes.countryCode}
              onChange={(code) => {
                onSetLocationCodes({ countryCode: code, stateCode: "" });
                const name = Country.getCountryByCode(code)?.name || "";
                onFieldUpdate("location", "country", name);
                onFieldUpdate("location", "state", "");
                onFieldUpdate("location", "city", "");
                if (code && formErrors["location.country"]) {
                  onSetFormErrors((prev) => ({ ...prev, "location.country": undefined }));
                }
              }}
              placeholder="Search country..."
            />
            {formErrors["location.country"] && (
              <p className="text-xs text-destructive mt-1">{formErrors["location.country"]}</p>
            )}
          </div>
          <div data-error-field="location.state">
            <Label>State *</Label>
            <SearchableSelect
              options={
                locationCodes.countryCode
                  ? State.getStatesOfCountry(locationCodes.countryCode).map((s) => ({ label: s.name, value: s.isoCode }))
                  : []
              }
              value={locationCodes.stateCode}
              onChange={(code) => {
                onSetLocationCodes((prev) => ({ ...prev, stateCode: code }));
                const name = State.getStateByCodeAndCountry(code, locationCodes.countryCode)?.name || "";
                onFieldUpdate("location", "state", name);
                onFieldUpdate("location", "city", "");
                if (code && formErrors["location.state"]) {
                  onSetFormErrors((prev) => ({ ...prev, "location.state": undefined }));
                }
              }}
              placeholder="Search state..."
              disabled={!locationCodes.countryCode}
            />
            {formErrors["location.state"] && (
              <p className="text-xs text-destructive mt-1">{formErrors["location.state"]}</p>
            )}
          </div>
          <div data-error-field="location.city">
            <Label>City *</Label>
            <SearchableSelect
              options={
                locationCodes.countryCode && locationCodes.stateCode
                  ? City.getCitiesOfState(locationCodes.countryCode, locationCodes.stateCode).map((c) => ({ label: c.name, value: c.name }))
                  : []
              }
              value={formData.location.city}
              onChange={(val) => {
                onFieldUpdate("location", "city", val);
                if (val && formErrors["location.city"]) {
                  onSetFormErrors((prev) => ({ ...prev, "location.city": undefined }));
                }
              }}
              placeholder="Search city..."
              disabled={!locationCodes.stateCode}
            />
            {formErrors["location.city"] && (
              <p className="text-xs text-destructive mt-1">{formErrors["location.city"]}</p>
            )}
          </div>
        </div>
        <div data-error-field="location.address">
          <Label>Address *</Label>
          <Textarea
            data-error-field="location.address"
            value={formData.location.address}
            onChange={(e) => onFieldUpdate("location", "address", e.target.value)}
            placeholder="Full street address"
            rows={2}
            className={formErrors["location.address"] ? "border-destructive" : ""}
          />
          {formErrors["location.address"] && (
            <p className="text-xs text-destructive mt-1">{formErrors["location.address"]}</p>
          )}
        </div>
      </div>

      {/* Contact */}
      <div className="rounded-lg border border-border/60 bg-card p-3 space-y-4 sm:p-4">
        <h4 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">Contact</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div data-error-field="contact.email">
            <Label>Email *</Label>
            <Input
              data-error-field="contact.email"
              type="email"
              value={formData.contact.email}
              onChange={(e) => onFieldUpdate("contact", "email", e.target.value)}
              placeholder="admissions@university.edu"
              className={formErrors["contact.email"] ? "border-destructive" : ""}
            />
            {(formErrors["contact.email"] || (formData.contact.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact.email))) && (
              <p className="text-xs text-destructive mt-1">
                {formErrors["contact.email"] || "Please enter a valid email address"}
              </p>
            )}
          </div>
          <div data-error-field="contact.phone">
            <Label>Phone *</Label>
            <div className="flex items-center gap-2">
              <span className="inline-flex h-10 items-center rounded-md border border-border bg-muted px-3 text-sm font-medium text-muted-foreground select-none">
                +{Country.getCountryByCode(locationCodes.countryCode)?.phonecode || "\u2014"}
              </span>
              <Input
                data-error-field="contact.phone"
                className={`flex-1 ${formErrors["contact.phone"] ? "border-destructive" : ""}`}
                value={formData.contact.phone}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
                  onFieldUpdate("contact", "phone", digits);
                  if (digits && formErrors["contact.phone"]) {
                    onSetFormErrors((prev) => ({ ...prev, "contact.phone": undefined }));
                  }
                }}
                placeholder="9876543210"
                maxLength={10}
                inputMode="numeric"
              />
            </div>
            {formErrors["contact.phone"] ? (
              <p className="text-xs text-destructive mt-1">{formErrors["contact.phone"]}</p>
            ) : formData.contact.phone && formData.contact.phone.length < 10 ? (
              <p className="text-xs text-muted-foreground mt-1">{formData.contact.phone.length}/10 digits</p>
            ) : null}
          </div>
        </div>
        <div data-error-field="contact.admissionOfficeHours">
          <Label>Office Hours *</Label>
          <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-2 mt-1">
            <Select
              value={formData.contact._officeHoursDays || "Mon-Fri"}
              onValueChange={(val) => {
                onFieldUpdate("contact", "_officeHoursDays", val);
                const time = `${formData.contact._officeHoursFrom || "09:00"} - ${formData.contact._officeHoursTo || "17:00"}`;
                onFieldUpdate("contact", "admissionOfficeHours", `${val} ${time}`);
                if (val && formErrors["contact.admissionOfficeHours"]) {
                  onSetFormErrors((prev) => ({ ...prev, "contact.admissionOfficeHours": undefined }));
                }
              }}
            >
              <SelectTrigger className={formErrors["contact.admissionOfficeHours"] ? "border-destructive" : ""}><SelectValue placeholder="Days" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Mon-Fri">Mon – Fri</SelectItem>
                <SelectItem value="Mon-Sat">Mon – Sat</SelectItem>
                <SelectItem value="Mon-Sun">Mon – Sun</SelectItem>
                <SelectItem value="Sat-Sun">Sat – Sun</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">from</span>
            <Input
              type="time"
              value={formData.contact._officeHoursFrom || "09:00"}
              onChange={(e) => {
                onFieldUpdate("contact", "_officeHoursFrom", e.target.value);
                const days = formData.contact._officeHoursDays || "Mon-Fri";
                const to = formData.contact._officeHoursTo || "17:00";
                onFieldUpdate("contact", "admissionOfficeHours", `${days} ${e.target.value} - ${to}`);
              }}
            />
            <span className="text-sm text-muted-foreground">to</span>
            <Input
              type="time"
              value={formData.contact._officeHoursTo || "17:00"}
              onChange={(e) => {
                onFieldUpdate("contact", "_officeHoursTo", e.target.value);
                const days = formData.contact._officeHoursDays || "Mon-Fri";
                const from = formData.contact._officeHoursFrom || "09:00";
                onFieldUpdate("contact", "admissionOfficeHours", `${days} ${from} - ${e.target.value}`);
              }}
            />
          </div>
          {formErrors["contact.admissionOfficeHours"] ? (
            <p className="text-xs text-destructive mt-1">{formErrors["contact.admissionOfficeHours"]}</p>
          ) : (
            <p className="text-xs text-muted-foreground mt-1">{formData.contact.admissionOfficeHours}</p>
          )}
        </div>
      </div>
    </div>
  );
}
