import React from "react";

/**
 * Minimal loading fallback used inside Suspense on the contact-us page.
 * The (landing) layout provides the Header/Footer wrapper, so this is
 * just a centered spinner with text.
 */
export function ContactPageLoading() {
  return (
    <div className="flex items-center justify-center py-32">
      <div className="text-center">
        <div className="inline-block size-8 animate-spin rounded-full border-4 border-solid border-gold border-r-transparent" />
        <p className="text-sm text-gray-500 mt-4">Loading...</p>
      </div>
    </div>
  );
}
