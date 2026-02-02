import { A, useNavigate, useSearchParams } from "@solidjs/router";
import { createSignal, Show } from "solid-js";
import { resetPassword } from "../api/auth";
import { ApiClientError } from "../api/client";
import { Button, Input } from "../components/common";
import { useFlash } from "../contexts/FlashContext";
import { validatePassword } from "../utils/validators";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const flash = useFlash();

  const [password, setPassword] = createSignal("");
  const [confirmPassword, setConfirmPassword] = createSignal("");
  const [errors, setErrors] = createSignal<Record<string, string>>({});
  const [serverError, setServerError] = createSignal("");
  const [loading, setLoading] = createSignal(false);

  const token = searchParams.token as string;

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setServerError("");

    const passwordValidation = validatePassword(password());
    const newErrors: Record<string, string> = {};

    if (!passwordValidation.valid) {
      newErrors.password = passwordValidation.message ?? "";
    }
    if (password() !== confirmPassword()) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (!token) {
      setServerError("Invalid or missing reset token");
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      await resetPassword(token, password());
      flash.showSuccess("Password reset successfully!");
      navigate("/login");
    } catch (err) {
      if (err instanceof ApiClientError) {
        setServerError(err.message);
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
          <h1 class="title">Reset Password</h1>
          <p class="subtitle">Enter your new password below</p>
        </div>

        <Show when={serverError()}>
          <div class="error">{serverError()}</div>
        </Show>

        <form class="form" onSubmit={handleSubmit}>
          <Input
            type="password"
            label="New Password"
            placeholder="Enter new password"
            value={password()}
            onInput={(e) => setPassword(e.currentTarget.value)}
            error={errors().password}
            required
          />

          <Input
            type="password"
            label="Confirm Password"
            placeholder="Confirm new password"
            value={confirmPassword()}
            onInput={(e) => setConfirmPassword(e.currentTarget.value)}
            error={errors().confirmPassword}
            required
          />

          <Button type="submit" variant="primary" fullWidth loading={loading()}>
            Reset Password
          </Button>
        </form>

        <div class="footer">
          Remember your password? <A href="/login">Sign in</A>
        </div>
      </div>
    </div>
  );
}
