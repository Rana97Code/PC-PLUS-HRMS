
import { createBrowserRouter } from 'react-router-dom';
import BlankLayout from '../components/Layouts/BlankLayout';
import DefaultLayout from '../components/Layouts/DefaultLayout';
import ProtectedRoute from './ProtectedRoute';
import { routes } from './routes';

const finalRoutes = routes.map((route: any) => {
    const pageElement =
        route.layout === 'blank' ? (
            route.element
        ) : (
            <ProtectedRoute permission={route.permission}>
                {route.element}
            </ProtectedRoute>
        );

    return {
        ...route,
        element:
            route.layout === 'blank' ? (
                <BlankLayout>{pageElement}</BlankLayout>
            ) : (
                <DefaultLayout>{pageElement}</DefaultLayout>
            ),
    };
});

const router = createBrowserRouter(finalRoutes);

export default router;