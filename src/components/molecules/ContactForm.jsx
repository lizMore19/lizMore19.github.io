import { useState, useRef, useMemo } from "react";

function Label(props) {
    return (
        <label className="block font-semibold mb-1">
            {props.children}
        </label>
    );
}

function Input({props, ...rest}) {
    return (
        <input
            className="w-full p-3 rounded-lg bg-slate-100 border border-slate-300 focus:ring-2 focus:ring-pink-400 outline-none"
            {...rest}
        />
    );
}

function TextArea({props, ...rest}) {
    return (
        <textarea
            className="w-full p-3 rounded-lg bg-slate-100 border border-slate-300 focus:ring-2 focus:ring-pink-400 outline-none"
            {...rest}
        />
    )
}

export default function ContactFrom() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" });

    const nameRef = useRef(null)
    const emailRef = useRef(null)
    const messageRef = useRef(null)

    // REEMPLAZA ESTA URL CON LA URL DE TU GOOGLE APPS SCRIPT
    const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzwX1aMOMXssQRBTynkZ1kb3SeSnwGkVgKblV7UI2GCr--knpi2sbaW7lwLi-UipB8img/exec";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ text: "", type: "" });

        const formData = {
            nombre: nameRef.current.value,
            correo: emailRef.current.value,
            asunto: messageRef.current.value
        };

        // Validación básica
        if (!formData.nombre || !formData.correo || !formData.asunto) {
            setMessage({ text: "Por favor completa todos los campos", type: "error" });
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(GOOGLE_SCRIPT_URL, {
                method: "POST",
                mode: "no-cors", // Importante para Google Apps Script
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData)
            });

            // Con no-cors no podemos leer la respuesta, pero si llega aquí es que se envió
            setMessage({ 
                text: "¡Mensaje enviado correctamente! Gracias por contactarnos.", 
                type: "success" 
            });
            
            // Limpiar formulario
            nameRef.current.value = "";
            emailRef.current.value = "";
            messageRef.current.value = "";

        } catch (error) {
            console.error("Error:", error);
            setMessage({ 
                text: "Hubo un error al enviar el mensaje. Por favor intenta de nuevo.", 
                type: "error" 
            });
        } finally {
            setLoading(false);
        }
    }

    const SubmiButton = useMemo(() => {
        return (
            <button
                type="button"
                onClick={handleSubmit}
                className="w-full py-3 bg-pink-500 hover:bg-pink-600 transition text-white rounded-lg font-bold text-lg disabled:cursor-not-allowed disabled:bg-pink-300"
                disabled={loading}
            >
                {loading ? "Enviando..." : "Enviar"}
            </button>
        );
    }, [loading, handleSubmit]);

    return (
        <div className="w-full flex justify-center mt-10 px-4">
            <div className="max-w-lg w-full bg-white shadow-lg rounded-xl p-8 border border-slate-200">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                    Formulario de Contacto
                </h2>
                
                <fieldset className="space-y-6" disabled={loading}>
                    <div>
                        <Label>Nombre</Label>
                        <Input 
                            placeholder="Tu nombre completo" 
                            ref={nameRef}
                        />
                    </div>
                    <div>
                        <Label>Correo</Label>
                        <Input 
                            type="email" 
                            placeholder="tu@correo.com" 
                            ref={emailRef}
                        />
                    </div>
                    <div>
                        <Label>Mensaje</Label>
                        <TextArea 
                            placeholder="Escribe tu mensaje aquí..." 
                            rows={6} 
                            ref={messageRef}
                        />
                    </div>

                    {message.text && (
                        <div className={`p-4 rounded-lg ${
                            message.type === "success" 
                                ? "bg-green-100 text-green-800 border border-green-300" 
                                : "bg-red-100 text-red-800 border border-red-300"
                        }`}>
                            {message.text}
                        </div>
                    )}

                    {SubmiButton}
                </fieldset>

            </div>
        </div>
    );
}



