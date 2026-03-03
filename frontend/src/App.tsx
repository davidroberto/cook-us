import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { BackofficeLayout } from '@src/layouts/backoffice.layout'
import { UsersTablePage } from '@src/modules/users/usersTable.page'
import { CookRequestsTablePage } from '@src/modules/cookRequests/cookRequestsTable.page'

export const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<BackofficeLayout />}>
                    <Route index element={<Navigate to="/users" replace />} />
                    <Route path="/users" element={<UsersTablePage />} />
                    <Route path="/cook-requests" element={<CookRequestsTablePage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}
