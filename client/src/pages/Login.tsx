import { A, useNavigate } from "@solidjs/router";
import { createSignal, Show } from "solid-js";
import { ApiClientError } from "../api/client";
import { Button, Input } from "../components/common";
import { useAuth } from "../contexts/AuthContext";
import { useFlash } from "../contexts/FlashContext";
import { validateEmail, validatePassword } from "../utils/validators";

export default function Login() {
  const navigate = useNavigate();
  const auth = useAuth();
  const flash = useFlash();

  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [errors, setErrors] = createSignal<{
    email?: string;
    password?: string;
  }>({});
  const [serverError, setServerError] = createSignal("");
  const [loading, setLoading] = createSignal(false);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setServerError("");

    // Validate
    const emailValidation = validateEmail(email());
    const passwordValidation = validatePassword(password());

    if (!emailValidation.valid || !passwordValidation.valid) {
      setErrors({
        email: emailValidation.message,
        password: passwordValidation.message,
      });
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      await auth.login(email(), password());
      flash.showSuccess("Welcome back!");
      navigate("/");
    } catch (error) {
      if (error instanceof ApiClientError) {
        setServerError(error.message);
      } else {
        setServerError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="page">
      <div class="card">
        <div class="header">
          <h1 class="title">Welcome Back</h1>
          <p class="subtitle">Sign in to your account to continue</p>
        </div>

        <Show when={serverError()}>
          <div class="error">{serverError()}</div>
        </Show>

        <form class="form" onSubmit={handleSubmit}>
          <Input
            type="email"
            label="Email"
            placeholder="Enter your email"
            value={email()}
            onInput={(e) => setEmail(e.currentTarget.value)}
            error={errors().email}
            required
          />

          <Input
            type="password"
            label="Password"
            placeholder="Enter your password"
            value={password()}
            onInput={(e) => setPassword(e.currentTarget.value)}
            error={errors().password}
            required
          />

          <div class="forgotPassword">
            <A href="/forgot-password">Forgot password?</A>
          </div>

          <Button type="submit" variant="primary" fullWidth loading={loading()}>
            Sign In
          </Button>
        </form>

        <div class="footer">
          Don't have an account? <A href="/register">Create one</A>
        </div>
      </div>
    </div>
  );
}
