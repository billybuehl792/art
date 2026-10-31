import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, Container } from "@mui/material";
import LoginForm, { type LoginFormProps } from "@/components/forms/LoginForm";
import queries from "@/queries";

export const Route = createFileRoute("/_app/login")({
  component: RouteComponent,
});

function RouteComponent() {
  /** Values */

  const navigate = useNavigate({ from: Route.fullPath });

  /** Mutations */

  const loginMutation = useMutation(queries.auth.post());

  /** Callbacks */

  const handleLoginOnSubmit: LoginFormProps["onSubmit"] = (body) =>
    loginMutation.mutateAsync(body, {
      onSuccess: () => navigate({ to: "/" }),
    });

  return (
    <Container>
      <Card sx={{ my: 2 }}>
        <CardContent>
          <LoginForm
            onSubmit={handleLoginOnSubmit}
            error={loginMutation.error}
          />
        </CardContent>
      </Card>
    </Container>
  );
}
