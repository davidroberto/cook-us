import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { BackofficeLayout } from '@src/layouts/backoffice.layout'
import { ProtectedRoute } from '@src/components/ui/protectedRoute'
import { LoginPage } from '@src/modules/auth/login.page'
import { UsersTablePage } from '@src/modules/users/usersTable.page'
import { UserDetailPage } from '@src/modules/users/userDetail.page'
import { CookRequestsTablePage } from '@src/modules/cookRequests/cookRequestsTable.page'

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
                    <Route index element={<Navigate to="/users" replace />} />
                    <Route path="/users" element={<UsersTablePage />} />
                    <Route path="/users/:id" element={<UserDetailPage />} />
                    <Route path="/cook-requests" element={<CookRequestsTablePage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}
