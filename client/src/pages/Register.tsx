import { A, useNavigate } from "@solidjs/router";
import { createSignal, Show } from "solid-js";
import { ApiClientError } from "../api/client";
import { Button, Input } from "../components/common";
import { useAuth } from "../contexts/AuthContext";
import { useFlash } from "../contexts/FlashContext";
import { validateEmail, validatePassword, validateRequired } from "../utils/validators";

export default function Register() {
  const navigate = useNavigate();
  const auth = useAuth();
  const flash = useFlash();

  const [name, setName] = createSignal("");
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [confirmPassword, setConfirmPassword] = createSignal("");
  const [errors, setErrors] = createSignal<Record<string, string>>({});
  const [serverError, setServerError] = createSignal("");
  const [loading, setLoading] = createSignal(false);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setServerError("");

    // Validate
    const nameValidation = validateRequired(name(), "Name");
    const emailValidation = validateEmail(email());
    const passwordValidation = validatePassword(password());

    const newErrors: Record<string, string> = {};

    if (!nameValidation.valid) newErrors.name = nameValidation.message ?? "";
    if (!emailValidation.valid) newErrors.email = emailValidation.message ?? "";
    if (!passwordValidation.valid) newErrors.password = passwordValidation.message ?? "";
    if (password() !== confirmPassword()) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      await auth.register(email(), password(), name());
      flash.showSuccess("Account created successfully!");
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
          <h1 class="title">Create Account</h1>
          <p class="subtitle">Join us and start your adventure</p>
        </div>

        <Show when={serverError()}>
          <div class="error">{serverError()}</div>
        </Show>

        <form class="form" onSubmit={handleSubmit}>
          <Input
            type="text"
            label="Full Name"
            placeholder="Enter your name"
            value={name()}
            onInput={(e) => setName(e.currentTarget.value)}
            error={errors().name}
            required
          />

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
            placeholder="Create a password"
            value={password()}
            onInput={(e) => setPassword(e.currentTarget.value)}
            error={errors().password}
            required
          />

          <Input
            type="password"
            label="Confirm Password"
            placeholder="Confirm your password"
            value={confirmPassword()}
            onInput={(e) => setConfirmPassword(e.currentTarget.value)}
            error={errors().confirmPassword}
            required
          />

          <Button type="submit" variant="primary" fullWidth loading={loading()}>
            Create Account
          </Button>
        </form>

        <div class="footer">
          Already have an account? <A href="/login">Sign in</A>
        </div>
      </div>
    </div>
  );
}
