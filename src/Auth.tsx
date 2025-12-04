import { useEffect, useState, type FormEvent } from "react";
import { remult } from "remult";
import App from "./App";

export default function Auth() {
    const [username, setUsername] = useState("")
    const [signedIn, setSignedIn] = useState(false);
    useEffect(() => {
        fetch("/api/currentUser").then(async result => {
            remult.user = await result.json();
            if (remult.user) setSignedIn(true);
        });
    }, []);

    if (!signedIn) {
        async function doSignIn(e: FormEvent<HTMLFormElement>) {
            e.preventDefault();
            const result = await fetch("/api/signIn", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username }),
            });
            if (result.ok) {
                remult.user = await result.json()
                setSignedIn(true)
                setUsername("")
            }
            else {
                alert(await result.json())
            }
        }


        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center font-sans text-gray-900 px-4">
                <main className="bg-white shadow-xl rounded-2xl p-6 md:p-8 w-full max-w-md border border-gray-200">
                    <h1 className="text-3xl font-bold text-center mb-8 tracking-tight">Welcome</h1>
                    <form onSubmit={(e) => doSignIn(e)} className="flex flex-col gap-4">
                        <input
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            placeholder="Username (try Rhizza or Discaya)"
                            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-black focus:ring-0 transition-all placeholder-gray-400"
                        />
                        <button className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95">
                            Sign In
                        </button>
                    </form>
                </main>
            </div>
        );
    }
    async function signOut() {
        await fetch("/api/signOut", { method: "POST" });
        setSignedIn(false);
        remult.user = undefined;
    }

    return <>
        <header className="flex flex-col sm:flex-row justify-between items-center p-4 bg-white border-b border-gray-200 shadow-sm gap-4 sm:gap-0">
            <span className="font-medium text-gray-700">Hello, <span className="font-bold text-black">{remult.user!.name}</span></span>
            <button onClick={() => signOut()} className="text-sm text-gray-500 hover:text-black font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                Sign Out
            </button>
        </header>
        <App />
    </>;
}