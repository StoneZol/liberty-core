export const asyncCall = async (func, ...args) => {
    try {
        const result = await func(...args);
        return { success: true, result: result };
    } catch (error) {
        return { success: false, message: error?.message ?? 'Unknown error' };
    }
};