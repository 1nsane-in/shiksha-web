"use client";

import { Button, Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Textarea } from "@repo/ui";
import { SUPPORTED_FOREIGN_BANK_COUNTRIES, getBankConfig, type BankFieldConfig } from "@repo/shared-types";
import type { WizardStep8Props } from "./new-page.types";

function renderBankFields(
  countryCode: string,
  formData: any,
  extraBankFields: Array<{ key: string; value: string }>,
  onFieldUpdate: (section: string, field: string, value: any) => void,
  onSetExtraBankFields: (fields: Array<{ key: string; value: string }>) => void,
) {
  const config = getBankConfig(countryCode);
  if (!config) return null;

  const updateBankField = (name: string, value: any) => {
    const current = formData.admin.bankDetails || {};
    onFieldUpdate("admin", "bankDetails", { ...current, [name]: value });
  };

  return (
    <>
      {config.fields.map((field: BankFieldConfig) => {
        const val = formData.admin.bankDetails?.[field.name] || "";
        const commonProps = {
          value: val,
          onChange: (e: any) => updateBankField(field.name, e.target.value),
          placeholder: field.placeholder,
        };

        if (field.type === "textarea") {
          return (
            <div key={field.name} className="sm:col-span-2">
              <Label>
                {field.label}
                {field.required && <span className="text-destructive ml-0.5">*</span>}
              </Label>
              <Textarea rows={2} {...commonProps} />
              {field.hint && <p className="text-xs text-muted-foreground mt-1">{field.hint}</p>}
            </div>
          );
        }

        return (
          <div key={field.name}>
            <Label>
              {field.label}
              {field.required && <span className="text-destructive ml-0.5">*</span>}
            </Label>
            <Input {...commonProps} />
            {field.hint && <p className="text-xs text-muted-foreground mt-1">{field.hint}</p>}
          </div>
        );
      })}

      {(extraBankFields || []).map((item, idx) => (
        <div key={`extra-${idx}`} className="relative sm:col-span-2 flex items-start gap-2">
          <div className="flex-1 grid grid-cols-2 gap-2">
            <div>
              <Label>Field Name</Label>
              <Input
                value={item.key}
                onChange={(e) => {
                  const copy = [...extraBankFields];
                  copy[idx] = { ...copy[idx], key: e.target.value };
                  onSetExtraBankFields(copy);
                }}
                placeholder="e.g. Routing Number"
              />
            </div>
            <div>
              <Label>Value</Label>
              <Input
                value={item.value}
                onChange={(e) => {
                  const copy = [...extraBankFields];
                  copy[idx] = { ...copy[idx], value: e.target.value };
                  onSetExtraBankFields(copy);
                }}
                placeholder="Field value"
              />
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="mt-6 shrink-0 h-9 w-9 text-destructive"
            onClick={() => onSetExtraBankFields(extraBankFields.filter((_, i) => i !== idx))}
          >
            ✕
          </Button>
        </div>
      ))}

      <div className="sm:col-span-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onSetExtraBankFields([...extraBankFields, { key: "", value: "" }])}
        >
          + Add Extra
        </Button>
      </div>
    </>
  );
}

export function BankDetailsStep(props: WizardStep8Props) {
  const { formData, formErrors, onFieldUpdate, onSetSelectedBankCountry, selectedBankCountry, extraBankFields, onSetExtraBankFields } = props;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Point of Contact */}
      <div className="rounded-lg border border-border/60 bg-card p-3 space-y-4 sm:p-4">
        <h4 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">Point of Contact</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div data-error-field="admin.pocName">
            <Label>Name *</Label>
            <Input
              data-error-field="admin.pocName"
              value={formData.admin.pocName}
              onChange={(e) => onFieldUpdate("admin", "pocName", e.target.value)}
              placeholder="Contact person name"
              className={formErrors["admin.pocName"] ? "border-destructive" : ""}
            />
            {formErrors["admin.pocName"] && (
              <p className="text-xs text-destructive mt-1">{formErrors["admin.pocName"]}</p>
            )}
          </div>
          <div data-error-field="admin.pocDesignation">
            <Label>Designation *</Label>
            <Input
              data-error-field="admin.pocDesignation"
              value={formData.admin.pocDesignation}
              onChange={(e) => onFieldUpdate("admin", "pocDesignation", e.target.value)}
              placeholder="e.g. Admissions Officer"
              className={formErrors["admin.pocDesignation"] ? "border-destructive" : ""}
            />
            {formErrors["admin.pocDesignation"] && (
              <p className="text-xs text-destructive mt-1">{formErrors["admin.pocDesignation"]}</p>
            )}
          </div>
          <div data-error-field="admin.pocEmail">
            <Label>Email *</Label>
            <Input
              data-error-field="admin.pocEmail"
              type="email"
              value={formData.admin.pocEmail}
              onChange={(e) => onFieldUpdate("admin", "pocEmail", e.target.value)}
              placeholder="admin@university.edu"
              className={formErrors["admin.pocEmail"] ? "border-destructive" : ""}
            />
            {formErrors["admin.pocEmail"] && (
              <p className="text-xs text-destructive mt-1">{formErrors["admin.pocEmail"]}</p>
            )}
          </div>
          <div data-error-field="admin.phoneNumber">
            <Label>Phone *</Label>
            <div className="flex gap-2">
              <Select
                value={formData.admin.phoneCountryCode || "+91"}
                onValueChange={(value) => onFieldUpdate("admin", "phoneCountryCode", value)}
              >
                <SelectTrigger className="w-[100px] shrink-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {/* Asia */}
                  <SelectItem value="+91">🇮🇳 +91 India</SelectItem>
                  <SelectItem value="+86">🇨🇳 +86 China</SelectItem>
                  <SelectItem value="+81">🇯🇵 +81 Japan</SelectItem>
                  <SelectItem value="+82">🇰🇷 +82 South Korea</SelectItem>
                  <SelectItem value="+65">🇸🇬 +65 Singapore</SelectItem>
                  <SelectItem value="+66">🇹🇭 +66 Thailand</SelectItem>
                  <SelectItem value="+62">🇮🇩 +62 Indonesia</SelectItem>
                  <SelectItem value="+60">🇲🇾 +60 Malaysia</SelectItem>
                  <SelectItem value="+63">🇵🇭 +63 Philippines</SelectItem>
                  <SelectItem value="+84">🇻🇳 +84 Vietnam</SelectItem>
                  <SelectItem value="+880">🇧🇩 +880 Bangladesh</SelectItem>
                  <SelectItem value="+92">🇵🇰 +92 Pakistan</SelectItem>
                  <SelectItem value="+94">🇱🇰 +94 Sri Lanka</SelectItem>
                  <SelectItem value="+95">🇲🇲 +95 Myanmar</SelectItem>
                  <SelectItem value="+977">🇳🇵 +977 Nepal</SelectItem>
                  <SelectItem value="+968">🇴🇲 +968 Oman</SelectItem>
                  <SelectItem value="+971">🇦🇪 +971 UAE</SelectItem>
                  <SelectItem value="+966">🇸🇦 +966 Saudi Arabia</SelectItem>
                  <SelectItem value="+974">🇶🇦 +974 Qatar</SelectItem>
                  <SelectItem value="+973">🇧🇭 +973 Bahrain</SelectItem>
                  <SelectItem value="+965">🇰🇼 +965 Kuwait</SelectItem>
                  <SelectItem value="+962">🇯🇴 +962 Jordan</SelectItem>
                  <SelectItem value="+961">🇱🇧 +961 Lebanon</SelectItem>
                  <SelectItem value="+90">🇹🇷 +90 Turkey</SelectItem>
                  <SelectItem value="+98">🇮🇷 +98 Iran</SelectItem>
                  <SelectItem value="+964">🇮🇶 +964 Iraq</SelectItem>
                  <SelectItem value="+967">🇾🇪 +967 Yemen</SelectItem>
                  <SelectItem value="+93">🇦🇫 +93 Afghanistan</SelectItem>
                  <SelectItem value="+976">🇲🇳 +976 Mongolia</SelectItem>
                  <SelectItem value="+850">🇰🇵 +850 North Korea</SelectItem>
                  <SelectItem value="+95">🇲🇲 +95 Myanmar</SelectItem>
                  <SelectItem value="+855">🇰🇭 +855 Cambodia</SelectItem>
                  <SelectItem value="+856">🇱🇦 +856 Laos</SelectItem>
                  <SelectItem value="+673">🇧🇳 +673 Brunei</SelectItem>
                  <SelectItem value="+670">🇹🇱 +670 Timor-Leste</SelectItem>
                  <SelectItem value="+960">🇲🇻 +960 Maldives</SelectItem>
                  <SelectItem value="+975">🇧🇹 +975 Bhutan</SelectItem>
                  {/* Europe */}
                  <SelectItem value="+44">🇬🇧 +44 UK</SelectItem>
                  <SelectItem value="+49">🇩🇪 +49 Germany</SelectItem>
                  <SelectItem value="+33">🇫🇷 +33 France</SelectItem>
                  <SelectItem value="+39">🇮🇹 +39 Italy</SelectItem>
                  <SelectItem value="+34">🇪🇸 +34 Spain</SelectItem>
                  <SelectItem value="+31">🇳🇱 +31 Netherlands</SelectItem>
                  <SelectItem value="+32">🇧🇪 +32 Belgium</SelectItem>
                  <SelectItem value="+41">🇨🇭 +41 Switzerland</SelectItem>
                  <SelectItem value="+43">🇦🇹 +43 Austria</SelectItem>
                  <SelectItem value="+45">🇩🇰 +45 Denmark</SelectItem>
                  <SelectItem value="+46">🇸🇪 +46 Sweden</SelectItem>
                  <SelectItem value="+47">🇳🇴 +47 Norway</SelectItem>
                  <SelectItem value="+358">🇫🇮 +358 Finland</SelectItem>
                  <SelectItem value="+48">🇵🇱 +48 Poland</SelectItem>
                  <SelectItem value="+420">🇨🇿 +420 Czech Republic</SelectItem>
                  <SelectItem value="+421">🇸🇰 +421 Slovakia</SelectItem>
                  <SelectItem value="+36">🇭🇺 +36 Hungary</SelectItem>
                  <SelectItem value="+40">🇷🇴 +40 Romania</SelectItem>
                  <SelectItem value="+359">🇧🇬 +359 Bulgaria</SelectItem>
                  <SelectItem value="+386">🇸🇮 +386 Slovenia</SelectItem>
                  <SelectItem value="+385">🇭🇷 +385 Croatia</SelectItem>
                  <SelectItem value="+381">🇷🇸 +381 Serbia</SelectItem>
                  <SelectItem value="+382">🇲🇪 +382 Montenegro</SelectItem>
                  <SelectItem value="+383">🇽🇰 +383 Kosovo</SelectItem>
                  <SelectItem value="+389">🇲🇰 +389 North Macedonia</SelectItem>
                  <SelectItem value="+387">🇧🇦 +387 Bosnia</SelectItem>
                  <SelectItem value="+355">🇦🇱 +355 Albania</SelectItem>
                  <SelectItem value="+30">🇬🇷 +30 Greece</SelectItem>
                  <SelectItem value="+357">🇨🇾 +357 Cyprus</SelectItem>
                  <SelectItem value="+356">🇲🇹 +356 Malta</SelectItem>
                  <SelectItem value="+372">🇪🇪 +372 Estonia</SelectItem>
                  <SelectItem value="+371">🇱🇻 +371 Latvia</SelectItem>
                  <SelectItem value="+370">🇱🇹 +370 Lithuania</SelectItem>
                  <SelectItem value="+375">🇧🇾 +375 Belarus</SelectItem>
                  <SelectItem value="+380">🇺🇦 +380 Ukraine</SelectItem>
                  <SelectItem value="+7">🇷🇺 +7 Russia</SelectItem>
                  <SelectItem value="+374">🇦🇲 +374 Armenia</SelectItem>
                  <SelectItem value="+995">🇬🇪 +995 Georgia</SelectItem>
                  <SelectItem value="+994">🇦🇿 +994 Azerbaijan</SelectItem>
                  <SelectItem value="+373">🇲🇩 +373 Moldova</SelectItem>
                  {/* Americas */}
                  <SelectItem value="+1">🇺🇸 +1 USA</SelectItem>
                  <SelectItem value="+1">🇨🇦 +1 Canada</SelectItem>
                  <SelectItem value="+52">🇲🇽 +52 Mexico</SelectItem>
                  <SelectItem value="+55">🇧🇷 +55 Brazil</SelectItem>
                  <SelectItem value="+54">🇦🇷 +54 Argentina</SelectItem>
                  <SelectItem value="+56">🇨🇱 +56 Chile</SelectItem>
                  <SelectItem value="+51">🇵🇪 +51 Peru</SelectItem>
                  <SelectItem value="+57">🇨🇴 +57 Colombia</SelectItem>
                  <SelectItem value="+58">🇻🇪 +58 Venezuela</SelectItem>
                  <SelectItem value="+593">🇪🇨 +593 Ecuador</SelectItem>
                  <SelectItem value="+591">🇧🇴 +591 Bolivia</SelectItem>
                  <SelectItem value="+595">🇵🇾 +595 Paraguay</SelectItem>
                  <SelectItem value="+598">🇺🇾 +598 Uruguay</SelectItem>
                  <SelectItem value="+502">🇬🇹 +502 Guatemala</SelectItem>
                  <SelectItem value="+503">🇸🇻 +503 El Salvador</SelectItem>
                  <SelectItem value="+504">🇭🇳 +504 Honduras</SelectItem>
                  <SelectItem value="+505">🇳🇮 +505 Nicaragua</SelectItem>
                  <SelectItem value="+506">🇨🇷 +506 Costa Rica</SelectItem>
                  <SelectItem value="+507">🇵🇦 +507 Panama</SelectItem>
                  <SelectItem value="+809">🇩🇴 +809 Dominican Republic</SelectItem>
                  <SelectItem value="+876">🇯🇲 +876 Jamaica</SelectItem>
                  <SelectItem value="+1">🇹🇹 +1 Trinidad</SelectItem>
                  <SelectItem value="+53">🇨🇺 +53 Cuba</SelectItem>
                  {/* Africa */}
                  <SelectItem value="+27">🇿🇦 +27 South Africa</SelectItem>
                  <SelectItem value="+234">🇳🇬 +234 Nigeria</SelectItem>
                  <SelectItem value="+254">🇰🇪 +254 Kenya</SelectItem>
                  <SelectItem value="+20">🇪🇬 +20 Egypt</SelectItem>
                  <SelectItem value="+212">🇲🇦 +212 Morocco</SelectItem>
                  <SelectItem value="+213">🇩🇿 +213 Algeria</SelectItem>
                  <SelectItem value="+216">🇹🇳 +216 Tunisia</SelectItem>
                  <SelectItem value="+218">🇱🇾 +218 Libya</SelectItem>
                  <SelectItem value="+249">🇸🇩 +249 Sudan</SelectItem>
                  <SelectItem value="+251">🇪🇹 +251 Ethiopia</SelectItem>
                  <SelectItem value="+255">🇹🇿 +255 Tanzania</SelectItem>
                  <SelectItem value="+256">🇺🇬 +256 Uganda</SelectItem>
                  <SelectItem value="+243">🇨🇩 +243 DR Congo</SelectItem>
                  <SelectItem value="+242">🇨🇬 +242 Congo</SelectItem>
                  <SelectItem value="+225">🇨🇮 +225 Ivory Coast</SelectItem>
                  <SelectItem value="+233">🇬🇭 +233 Ghana</SelectItem>
                  <SelectItem value="+228">🇹🇬 +228 Togo</SelectItem>
                  <SelectItem value="+229">🇧🇯 +229 Benin</SelectItem>
                  <SelectItem value="+227">🇳🇪 +227 Niger</SelectItem>
                  <SelectItem value="+235">🇹🇩 +235 Chad</SelectItem>
                  <SelectItem value="+237">🇨🇲 +237 Cameroon</SelectItem>
                  <SelectItem value="+241">🇬🇦 +241 Gabon</SelectItem>
                  <SelectItem value="+240">🇬🇶 +240 Equatorial Guinea</SelectItem>
                  <SelectItem value="+244">🇦🇴 +244 Angola</SelectItem>
                  <SelectItem value="+260">🇿🇲 +260 Zambia</SelectItem>
                  <SelectItem value="+263">🇿🇼 +263 Zimbabwe</SelectItem>
                  <SelectItem value="+264">🇳🇦 +264 Namibia</SelectItem>
                  <SelectItem value="+267">🇧🇼 +267 Botswana</SelectItem>
                  <SelectItem value="+265">🇲🇼 +265 Malawi</SelectItem>
                  <SelectItem value="+265">🇲🇿 +258 Mozambique</SelectItem>
                  <SelectItem value="+261">🇲🇬 +261 Madagascar</SelectItem>
                  <SelectItem value="+230">🇲🇺 +230 Mauritius</SelectItem>
                  {/* Oceania */}
                  <SelectItem value="+61">🇦🇺 +61 Australia</SelectItem>
                  <SelectItem value="+64">🇳🇿 +64 New Zealand</SelectItem>
                  <SelectItem value="+675">🇵🇬 +675 Papua New Guinea</SelectItem>
                  <SelectItem value="+679">🇫🇯 +679 Fiji</SelectItem>
                  <SelectItem value="+682">🇨🇰 +682 Cook Islands</SelectItem>
                  <SelectItem value="+683">🇳🇺 +683 Niue</SelectItem>
                  <SelectItem value="+685">🇼🇸 +685 Samoa</SelectItem>
                  <SelectItem value="+676">🇹🇴 +676 Tonga</SelectItem>
                  <SelectItem value="+678">🇻🇺 +678 Vanuatu</SelectItem>
                  <SelectItem value="+680">🇵🇼 +680 Palau</SelectItem>
                  <SelectItem value="+674">🇳🇷 +674 Nauru</SelectItem>
                  <SelectItem value="+672">🇰🇮 +672 Kiribati</SelectItem>
                  <SelectItem value="+691">🇫🇲 +691 Micronesia</SelectItem>
                  <SelectItem value="+692">🇲🇭 +692 Marshall Islands</SelectItem>
                  <SelectItem value="+688">🇹🇻 +688 Tuvalu</SelectItem>
                  <SelectItem value="+677">🇸🇧 +677 Solomon Islands</SelectItem>
                </SelectContent>
              </Select>
              <Input
                data-error-field="admin.phoneNumber"
                type="tel"
                inputMode="numeric"
                maxLength={10}
                value={formData.admin.phoneNumber}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
                  onFieldUpdate("admin", "phoneNumber", digits);
                }}
                placeholder="10-digit number"
                className={formErrors["admin.phoneNumber"] || formErrors["admin.phoneCountryCode"] ? "border-destructive" : ""}
              />
            </div>
            {(formErrors["admin.phoneNumber"] || formErrors["admin.phoneCountryCode"]) && (
              <p className="text-xs text-destructive mt-1">
                {formErrors["admin.phoneNumber"] || formErrors["admin.phoneCountryCode"]}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Bank Details */}
      <div className="rounded-lg border border-border/60 bg-card p-3 space-y-4 sm:p-4">
        <h4 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">Bank Details</h4>
        <div>
          <Label>Bank Country *</Label>
          <Select
            value={selectedBankCountry}
            onValueChange={(code: string | null) => {
              const countryCode = code ?? "";
              onSetSelectedBankCountry(countryCode);
              onSetExtraBankFields([]);
              onFieldUpdate("admin", "bankCountry", countryCode);
              if (countryCode && countryCode !== "IN") {
                onFieldUpdate("admin", "bankDetails", {});
              }
            }}
          >
            <SelectTrigger className="max-w-xs">
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="IN">India</SelectItem>
              {SUPPORTED_FOREIGN_BANK_COUNTRIES.map((c) => (
                <SelectItem key={c.code} value={c.code}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedBankCountry === "IN" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div data-error-field="admin.accountName">
              <Label>Account Name *</Label>
              <Input
                data-error-field="admin.accountName"
                value={formData.admin.accountName}
                onChange={(e) => onFieldUpdate("admin", "accountName", e.target.value)}
                placeholder="Name on bank account"
                className={formErrors["admin.accountName"] ? "border-destructive" : ""}
              />
              {formErrors["admin.accountName"] && (
                <p className="text-xs text-destructive mt-1">{formErrors["admin.accountName"]}</p>
              )}
            </div>
            <div data-error-field="admin.accountNumber">
              <Label>Account Number *</Label>
              <Input
                data-error-field="admin.accountNumber"
                value={formData.admin.accountNumber}
                onChange={(e) => onFieldUpdate("admin", "accountNumber", e.target.value)}
                placeholder="Bank account number"
                className={formErrors["admin.accountNumber"] ? "border-destructive" : ""}
              />
              {formErrors["admin.accountNumber"] && (
                <p className="text-xs text-destructive mt-1">{formErrors["admin.accountNumber"]}</p>
              )}
            </div>
            <div data-error-field="admin.bankName">
              <Label>Bank Name *</Label>
              <Input
                data-error-field="admin.bankName"
                value={formData.admin.bankName}
                onChange={(e) => onFieldUpdate("admin", "bankName", e.target.value)}
                placeholder="e.g. State Bank of India"
                className={formErrors["admin.bankName"] ? "border-destructive" : ""}
              />
              {formErrors["admin.bankName"] && (
                <p className="text-xs text-destructive mt-1">{formErrors["admin.bankName"]}</p>
              )}
            </div>
            <div data-error-field="admin.bankBranch">
              <Label>Bank Branch *</Label>
              <Input
                data-error-field="admin.bankBranch"
                value={formData.admin.bankBranch}
                onChange={(e) => onFieldUpdate("admin", "bankBranch", e.target.value)}
                placeholder="Branch name"
                className={formErrors["admin.bankBranch"] ? "border-destructive" : ""}
              />
              {formErrors["admin.bankBranch"] && (
                <p className="text-xs text-destructive mt-1">{formErrors["admin.bankBranch"]}</p>
              )}
            </div>
            <div data-error-field="admin.ifscCode">
              <Label>IFSC / SWIFT Code *</Label>
              <Input
                data-error-field="admin.ifscCode"
                value={formData.admin.ifscCode}
                onChange={(e) => onFieldUpdate("admin", "ifscCode", e.target.value)}
                placeholder="e.g. SBIN0001234"
                className={formErrors["admin.ifscCode"] ? "border-destructive" : ""}
              />
              {formErrors["admin.ifscCode"] && (
                <p className="text-xs text-destructive mt-1">{formErrors["admin.ifscCode"]}</p>
              )}
            </div>
            <div data-error-field="admin.commission">
              <Label>Commission (%) *</Label>
              <Input
                data-error-field="admin.commission"
                type="text"
                inputMode="numeric"
                value={formData.admin.commission || ""}
                onChange={(e) => onFieldUpdate("admin", "commission", parseFloat(e.target.value) || 0)}
                placeholder="e.g. 10"
                className={formErrors["admin.commission"] ? "border-destructive" : ""}
              />
              {formErrors["admin.commission"] && (
                <p className="text-xs text-destructive mt-1">{formErrors["admin.commission"]}</p>
              )}
            </div>
            <div>
              <Label>GST Number</Label>
              <Input
                value={formData.admin.gstNumber}
                onChange={(e) => onFieldUpdate("admin", "gstNumber", e.target.value)}
                placeholder="Optional"
              />
            </div>
            <div>
              <Label>PAN Number</Label>
              <Input
                value={formData.admin.panNumber}
                onChange={(e) => onFieldUpdate("admin", "panNumber", e.target.value)}
                placeholder="Optional"
              />
            </div>
          </div>
        )}

        {selectedBankCountry && selectedBankCountry !== "IN" && (
          <div>
            <h5 className="text-sm font-medium text-foreground/80 mb-3">
              {getBankConfig(selectedBankCountry)?.countryName || selectedBankCountry} Bank Details
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {renderBankFields(selectedBankCountry, formData, extraBankFields, onFieldUpdate, onSetExtraBankFields)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
