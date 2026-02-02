import { A } from "@solidjs/router";
import { createSignal, Show } from "solid-js";
import { forgotPassword } from "../api/auth";
import { ApiClientError } from "../api/client";
import { Button, Input } from "../components/common";
import { validateEmail } from "../utils/validators";

export default function ForgotPassword() {
  const [email, setEmail] = createSignal("");
  const [error, setError] = createSignal("");
  const [success, setSuccess] = createSignal(false);
  const [loading, setLoading] = createSignal(false);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setError("");

    const validation = validateEmail(email());
    if (!validation.valid) {
      setError(validation.message!);
      return;
    }

    setLoading(true);

    try {
      await forgotPassword(email());
      setSuccess(true);
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="page">
      <div class="card">
        <div class="header">
          <h1 class="title">Forgot Password</h1>
          <p class="subtitle">Enter your email and we'll send you a link to reset your password</p>
        </div>

        <Show when={success()}>
          <div class="success">Check your email! We've sent you a link to reset your password.</div>
        </Show>

        <Show when={error()}>
          <div class="error">{error()}</div>
        </Show>

        <Show when={!success()}>
          <form class="form" onSubmit={handleSubmit}>
            <Input
              type="email"
              label="Email"
              placeholder="Enter your email"
              value={email()}
              onInput={(e) => setEmail(e.currentTarget.value)}
              required
            />

            <Button type="submit" variant="primary" fullWidth loading={loading()}>
              Send Reset Link
            </Button>
          </form>
        </Show>

        <div class="footer">
          Remember your password? <A href="/login">Sign in</A>
        </div>
      </div>
    </div>
  );
}
