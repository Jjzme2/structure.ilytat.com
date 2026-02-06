import emailjs from '@emailjs/browser';

export const useEmail = () => {
    const config = useRuntimeConfig();

    // Log initialization if in client context
    if (import.meta.client) {
        if (config.public.emailjsPublicKey) {
            emailjs.init(config.public.emailjsPublicKey);
            console.info('%c 📧 EmailJS initialized ', 'color: #a6e3a1;');
        } else {
            console.warn('%c ⚠️ EmailJS Public Key missing! ', 'color: #f38ba8;');
        }
    }

    const sendEmail = async (templateParams: Record<string, unknown>) => {
        try {
            console.log('%c 📤 Sending email via EmailJS... ', 'color: #94e2d5;');
            const response = await emailjs.send(
                config.public.emailjsServiceId,
                config.public.emailjsTemplateId,
                templateParams,
                config.public.emailjsPublicKey
            );
            console.log('%c ✅ Email sent successfully ', 'color: #a6e3a1;', response.status, response.text);
            return { success: true, status: response.status, text: response.text };
        } catch (error) {
            console.error('%c ❌ EmailJS Error: ', 'color: #f38ba8;', error);
            return { success: false, error };
        }
    };

    return {
        sendEmail
    };
};
