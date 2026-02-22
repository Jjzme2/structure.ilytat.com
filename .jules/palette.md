## 2024-05-23 - Accessibility: Broken aria-describedby References
**Learning:** A recurring pattern in form components is the use of `aria-describedby` pointing to error message containers that lack the corresponding `id` attribute. This breaks the association for screen readers.
**Action:** Always verify that elements referenced by `aria-describedby` have a matching `id` attribute, especially for dynamically rendered error messages.
