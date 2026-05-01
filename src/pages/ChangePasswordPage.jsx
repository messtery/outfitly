import ChangePasswordForm from "@/components/auth/ChangePasswordForm"

export default function ChangePasswordPage() {
  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Password updated")
  }

  return <ChangePasswordForm onSubmit={handleSubmit} />
}
