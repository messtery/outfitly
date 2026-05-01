import ForgotPasswordForm from "@/components/ForgotPasswordForm"

export default function ForgotPasswordPage() {
  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Reset link dikirim")
  }

  return <ForgotPasswordForm onSubmit={handleSubmit} />
}
