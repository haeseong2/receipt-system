import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ReceiptUploadPage from "./pages/ReceiptUploadPage";
import ReceiptListPage from "./pages/ReceiptListPage";
import PrivateRoute from "./routes/PrivateRoute";
import MainLayout from "./components/layout/MainLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"               element={<LoginPage/>}/>
        <Route                        element={<PrivateRoute><MainLayout/></PrivateRoute>}>

        <Route path="/dashboard"      element={<PrivateRoute><DashboardPage/>      </PrivateRoute>}/>
        <Route path="/receiptUpload"  element={<PrivateRoute><ReceiptUploadPage/>  </PrivateRoute>}/>
        <Route path="/receiptList"    element={<PrivateRoute><ReceiptListPage />   </PrivateRoute>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;