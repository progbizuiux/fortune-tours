"use client";

import { useState } from "react";
import { CtaLink } from "@/components/common/CtaLink";
import { BookingEnquiryModal } from "@/components/packages/BookingEnquiryModal";

/* The one control in the booking band that opens the enquiry form instead of
 * navigating. A client leaf so BookingCtaSection — and the page around it —
 * stays a server component; only this button and the modal it owns ship as
 * client code.
 *
 * Still an anchor with a real href underneath: it renders as CtaLink, so it
 * looks and hovers exactly like the call button beside it, and a reader with
 * no JavaScript follows the link rather than pressing a control that does
 * nothing. The click handler is what turns it into a dialog.
 */
export function BookingCtaButton({
  href,
  label,
  className,
  withLeftDivider,
  dividerClassName,
  modalTitle,
  modalDescription,
  image,
  imageAlt,
  packageName,
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <CtaLink
        href={href || "#"}
        fill
        withLeftDivider={withLeftDivider}
        dividerClassName={dividerClassName}
        className={className}
        onClick={(event) => {
          event.preventDefault();
          setOpen(true);
        }}
      >
        {label}
      </CtaLink>

      <BookingEnquiryModal
        open={open}
        onClose={() => setOpen(false)}
        title={modalTitle}
        description={modalDescription}
        image={image}
        imageAlt={imageAlt}
        packageName={packageName}
      />
    </>
  );
}
