
function handleClerkError(error: any) {
    const formattedError = {
        statusCode: error.status || 422,
        success: false,
        message: error.errors?.[0]?.message || "An error occurred with Clerk.",
        data: {
            clerkTraceId: error.clerkTraceId,
            errors: error.errors,
        },
    };

    return formattedError;

};

export default handleClerkError;