import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { BackofficeLayout } from '@src/layouts/backoffice.layout'
import { ProtectedRoute } from '@src/modules/auth/protectedRoute'
import { LoginPage } from '@src/modules/auth/login.page'
import { UsersTablePage } from '@src/modules/users/usersTable.page'
import { UserDetailPage } from '@src/modules/users/userDetail.page'
import { CreateAdminPage } from '@src/modules/users/createAdmin.page'
import { CookRequestsTablePage } from '@src/modules/cookRequests/cookRequestsTable.page'
import { PendingCooksPage } from '@src/modules/pendingCooks/pendingCooks.page'
import { DashboardPage } from '@src/modules/dashboard/dashboard.page'

export const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route
                    element={
                        <ProtectedRoute>
                            <BackofficeLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/users" element={<UsersTablePage />} />
                    <Route path="/users/create" element={<CreateAdminPage />} />
                    <Route path="/users/:id" element={<UserDetailPage />} />
                    <Route path="/cook-requests" element={<CookRequestsTablePage />} />
                    <Route path="/pending-cooks" element={<PendingCooksPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}
