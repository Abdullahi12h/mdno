// Tenant scoping utility helper

export const getTenantFilter = (req) => {
    if (!req.user) return {};

    if (req.user.role === 'SuperAdmin') {
        if (req.query && req.query.tenantId) {
            return { tenantId: req.query.tenantId };
        }
        return {};
    }

    if (req.tenantId || req.user.tenantId) {
        return { tenantId: req.tenantId || req.user.tenantId };
    }

    return {};
};

export const applyTenantId = (data, req) => {
    if (req.user && req.user.role !== 'SuperAdmin' && (req.tenantId || req.user.tenantId)) {
        return {
            ...data,
            tenantId: req.tenantId || req.user.tenantId,
        };
    }
    if (req.body && req.body.tenantId) {
        return {
            ...data,
            tenantId: req.body.tenantId,
        };
    }
    return data;
};
