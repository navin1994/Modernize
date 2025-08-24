import { Routes } from "@angular/router";
import { BlankComponent } from "./layouts/blank/blank.component";
import { FullComponent } from "./layouts/full/full.component";
import { AppFormComponent } from "./form/form.component";
import { WindowDemoComponent } from "./pages/window-demo/window-demo.component";

export const routes: Routes = [
  {
    path: "",
    component: FullComponent,
    children: [
      {
        path: "",
        redirectTo: "/dashboard",
        pathMatch: "full",
      },
      {
        path: "dashboard",
        loadChildren: () =>
          import("./pages/pages.routes").then((m) => m.PagesRoutes),
      },
      {
        path: "form",
        component: AppFormComponent,
      },
      {
        path: "form-builder",
        component: AppFormComponent,
      },
      {
        path: "window-demo",
        component: WindowDemoComponent,
        data: {
          title: "Window System Demo",
          urls: [
            { title: "Dashboard", url: "/dashboard" },
            { title: "Window Demo" },
          ],
        },
      },
      {
        path: "ui-components",
        loadChildren: () =>
          import("./pages/ui-components/ui-components.routes").then(
            (m) => m.UiComponentsRoutes,
          ),
      },
      {
        path: "extra",
        loadChildren: () =>
          import("./pages/extra/extra.routes").then((m) => m.ExtraRoutes),
      },
    ],
  },
  {
    path: "",
    component: BlankComponent,
    children: [
      {
        path: "authentication",
        loadChildren: () =>
          import("./pages/authentication/authentication.routes").then(
            (m) => m.AuthenticationRoutes,
          ),
      },
    ],
  },
  {
    path: "**",
    redirectTo: "authentication/error",
  },
];
