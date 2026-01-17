# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.




# 📄 iVita - React Frontend Project

## 🏷 Project Overview

iVita is a modern React frontend application built with Vite, Redux Toolkit , and Tailwind CSS



Register → Verify OTP → Home
Login → Verify WhatsApp → Home

Home
 ├─ Category → Products → Product → Cart
 ├─ Search → Product
 ├─ Cart → add / Remove
 └─ Logout → Login

```

---

##  Features

### Authentication

* **Email & Password Registration**

  * Validation for required fields, email format, phone number, password match.
* **OTP Verification**

  * Email OTP for registration.
  * WhatsApp OTP login & verification.

Login

  * Email/password login.
  * WhatsApp login via OTP.

### State Management

Redux Toolkit

  * `authSlice` handles authentication state.
  * `cartSlice` (if applicable) handles cart functionality.
  *  ProductSclice   handle products

### UI & Styling

* **Tailwind CSS** for responsive design.
* **Reusable InputWrapper component** with icons and error messages.
* Clean, modern, mobile-friendly interface.

---

## 📥 Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/ivita-frontend.git
cd ivita-frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

* The app will be running at `http://localhost:5173` by default.

---

## 🔧 Usage

### Registration

1. Navigate to `/register`.
2. Fill in all required fields.
3. Accept terms & conditions.
4. Click **Create Account** → redirected to `/verify` for OTP verification.

### Login

* Navigate to `/login` and log in with WhatsApp OTP.

### Logout

* Click logout button to remove tokens from `localStorage`.

### Redux

* **Auth State**

  * `user`, `userId`, `phone`, `isAuthenticated`, `loading`, `error`
* **Actions**

  * `registerUser`, `verifyOTP`, `loginWhatsApp`, `verifyWhatsAppOTP`, `logout` , product, Cart

---

## 🛠 Scripts

npm run dev`     | Start development server        

---

## 🔗 Dependencies

* **React**: Frontend library
* **React Router DOM**: Routing
* **Redux Toolkit**: State management
* **Axios**: HTTP client
* **Tailwind CSS**: Styling
* **React Icons**: Icons for UI
* **Vite**: Build tool


* Configure API endpoints in `src/utils/axios.js`.
* Tokens are stored in `localStorage` (`access_token` & `refresh_token`).
* Phone numbers must be 12 digits (e.g., `201011111111`).

---

