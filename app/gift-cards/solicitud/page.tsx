
import { getActivePackages } from "@/app/actions/gift-card-actions";
import GiftCardRequestForm from "@/app/components/gift-cards/GiftCardRequestForm";

export default async function GiftCardRequestPage() {
    // Fetch active packages from the server action
    const packages = await getActivePackages();

    return (
        <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-extrabold text-barberia-gold font-agency tracking-wider">
                        JV STUDIO
                    </h1>
                    <p className="mt-2 text-sm text-gray-400">
                        Regala una experiencia única en barbería y cuidado personal.
                    </p>
                </div>

                <GiftCardRequestForm packages={packages} />
            </div>
        </main>
    );
}
