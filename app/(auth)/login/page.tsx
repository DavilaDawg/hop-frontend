"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Logo } from "@/components/ui/Logo";
import Link from "next/link";

export default function LoginPage() {
	const [email, setEmail] = React.useState("");
	const [password, setPassword] = React.useState("");
	const [errors, setErrors] = React.useState<{
		email?: string;
		password?: string;
	}>({});

	const validateForm = () => {
		const newErrors: {
			email?: string;
			password?: string;
		} = {};
		if (!email) newErrors.email = "Email is required";
		if (!password) newErrors.password = "Password is required";
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (validateForm()) {
			console.log("Form submitted");
		}
	};

	return (
		<>
			<Link className="text-blue-500 hover:underline" href="/">
				Home
			</Link>
			<div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
				<div className="p-8 bg-white rounded-lg shadow-md w-96">
					<Logo />
					<form className="space-y-6" onSubmit={handleSubmit}>
						<div>
							<Input
								type="email"
								placeholder="Email"
								required
								value={email}
								onChange={(event) => setEmail(event.target.value)}
							/>
							{errors.email && (
								<p className="text-red-500 text-sm mt-1">{errors.email}</p>
							)}
						</div>
						<div>
							<Input
								type="password"
								placeholder="Password"
								required
								value={password}
								onChange={(event) => setPassword(event.target.value)}
							/>
							{errors.password && (
								<p className="text-red-500 text-sm mt-1">{errors.password}</p>
							)}
						</div>
						<Button type="submit" className="w-full">
							Log in
						</Button>
					</form>
					<div className="mt-4 text-center">
						<div className="mt-4 text-center">Forgot your password?</div>
					</div>
					<div className="mt-6 text-center">
						<p className="text-sm text-gray-600">
							Don't have an account?{" "}
							<Link href="/register" className="text-blue-600 hover:underline">
								Sign up
							</Link>
						</p>
					</div>
				</div>
			</div>
		</>
	);
}
