---

# **Header Component Documentation**

## **Overview**

The `Header` component is the main navigation bar for the **ZetuTech** e-commerce platform.
It is designed to:

* Provide **top-level navigation** for desktop and mobile devices.
* Offer **search functionality** for products.
* Display **user account management** (sign-in/sign-out, profile, and admin dashboard access).
* Show **cart** and **wishlist** quick-access links.
* Allow **category-based product navigation**:

  * **Desktop:** Product types are shown in the navigation bar, and categories appear in a dropdown when hovering over a type.
  * **Mobile:** Product types and categories are displayed using an **accordion** inside a slide-out `Sheet` menu.
* Support **dark/light theme toggling** using a `<ModeToggle />` component.
* Show top info bar for **support contacts**, **delivery info**, and **working hours**.

---

## **Folder Structure**

Make sure your file structure matches this setup for easy integration:

```
src/
│
├── components/
│   ├── ui/
│   │   ├── dropdown-menu.tsx
│   │   ├── accordion.tsx
│   │   ├── sheet.tsx
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── badge.tsx
│   │   └── avatar.tsx
│   │
│   ├── header/
│   │   └── Header.tsx
│   │
│   └── theme/
│       └── ModeToggle.tsx
│
├── lib/
│   ├── auth-client.ts
│   └── validation-schemas/
│       └── product-type.ts
│
└── pages/
    └── index.tsx
```

---

## **Dependencies**

Ensure you have the following installed:

```bash
npm install next lucide-react shadcn-ui
```

---

## **Props**

| Prop      | Type             | Required | Description                                                |
| --------- | ---------------- | -------- | ---------------------------------------------------------- |
| `session` | `object \| null` | Yes      | Authenticated session object containing user data.         |
| `isAdmin` | `boolean`        | Yes      | Determines whether to show admin-related navigation links. |

### Example `session` object:

```ts
{
  user: {
    name: "John Doe",
    image: "/profile.jpg",
    role: "admin" // or "buyer"
  }
}
```

---

## **Key Features**

### 1. **Top Bar**

* Displays support phone, email, free shipping info, and warranty info.
* Shown on **all screen sizes**.
* Example:

  ```
  +255 123 456 789 | support@zetutech.co.tz | Free Shipping Over 500,000 TZS | 1-Year Warranty
  ```

---

### 2. **Main Navigation**

#### **Desktop**

* **Product Types** appear directly in the navbar.
* On hover, a **dropdown menu** appears showing **categories** under that product type.
* Example structure:

  ```
  Laptops ▼
    - Gaming Laptops
    - Business Laptops
  Desktops ▼
    - Gaming Desktops
    - All-in-One
  ```

#### **Mobile**

* Uses `Sheet` (slide-out sidebar).
* Categories are displayed in an **accordion** format.

---

### 3. **Search Bar**

* **Desktop:** Inline search bar in the center of the header.
* **Mobile:** Separate bar below the header.

The search query is handled with `useRouter`:

```ts
router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
```

---

### 4. **User Authentication**

* **Not Logged In:**
  Shows **Sign In** and **Sign Up** buttons.
* **Logged In:**
  Shows user avatar and dropdown menu with:

  * My Orders
  * My Wishlist
  * Account Settings
  * Admin Dashboard (if `isAdmin` is true)
  * Sign Out

---

### 5. **Wishlist and Cart**

* **Wishlist:** Shows heart icon with count badge.
* **Cart:** Shows cart icon with count badge.

Example:

```html
<Heart /> <span>3</span>
<ShoppingCart /> <span>2</span>
```

---

### 6. **Dark/Light Mode Toggle**

* Integrate `<ModeToggle />` in the top-right corner of the header.

Example usage:

```tsx
import ModeToggle from "@/components/theme/ModeToggle";

<ModeToggle />
```

Ensure you have theme setup with **TailwindCSS** and `shadcn/ui` theme provider.

---

## **Product Types and Categories Setup**

The navigation is powered by two constants defined in:
`/lib/validation-schemas/product-type.ts`

```ts
export const PRODUCT_TYPES = [
  { id: "laptops", label: "Laptops" },
  { id: "desktops", label: "Desktops" },
  { id: "accessories", label: "Accessories" },
];

export const PRODUCT_CATEGORIES = {
  laptops: ["Gaming Laptops", "Business Laptops", "Student Laptops"],
  desktops: ["Gaming Desktops", "All-in-One PCs"],
  accessories: ["Keyboards", "Mice", "Headsets"],
};
```

---

## **How It Works**

### Mobile Flow:

1. User taps **menu button** → `Sheet` opens.
2. Product types appear in an accordion.
3. Expanding a product type reveals sub-categories.

### Desktop Flow:

1. Product types are visible in the navbar.
2. Hovering over a type shows its sub-categories as a dropdown.

---

## **Code Example Usage**

Here’s how to include the `Header` component:

```tsx
import Header from "@/components/header/Header";

export default function HomePage() {
  const session = {
    user: {
      name: "Jane Doe",
      image: "/profile.jpg",
      role: "buyer",
    },
  };

  return (
    <>
      <Header session={session} isAdmin={false} />
      <main className="mt-10">
        <h1 className="text-3xl font-bold">Welcome to ZetuTech</h1>
      </main>
    </>
  );
}
```

---

## **Styling & Customization**

* The header uses **TailwindCSS utility classes** for styling.
* Modify colors and themes in your `tailwind.config.js`.
* Example theme customization:

  ```js
  theme: {
    extend: {
      colors: {
        primary: "#2563EB",
        destructive: "#EF4444",
      },
    },
  }
  ```

---

## **Performance Tips**

* Use `next/image` for logos and product images.
* Cache `PRODUCT_TYPES` and `PRODUCT_CATEGORIES` with a CMS or database for scalability.
* Lazy-load the mobile sidebar with `dynamic()` import if needed.

---

## **Future Improvements**

1. **Dynamic Product Data:**
   Fetch product types and categories from the database.
2. **Persistent Cart/Wishlist:**
   Connect to backend APIs.
3. **Multi-language Support:**
   Integrate `next-intl` or `react-i18next`.
4. **Better Theme Integration:**
   Improve `<ModeToggle />` to persist user preference across sessions.

---

## **Summary**

The `Header` component is a **responsive, scalable, and customizable** navigation bar built for ZetuTech.
It seamlessly integrates:

* Mobile and desktop navigation patterns,
* Product type/category management,
* User authentication,
* Dark/light theme support,
* And a search experience optimized for e-commerce.
