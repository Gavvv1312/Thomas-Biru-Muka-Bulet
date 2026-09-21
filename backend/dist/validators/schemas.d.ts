import { z } from 'zod';
export declare const registerSchema: z.ZodObject<{
    body: z.ZodObject<{
        nama: z.ZodString;
        email: z.ZodString;
        password: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        email: string;
        nama: string;
        password: string;
    }, {
        email: string;
        nama: string;
        password: string;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        email: string;
        nama: string;
        password: string;
    };
}, {
    body: {
        email: string;
        nama: string;
        password: string;
    };
}>;
export declare const loginSchema: z.ZodObject<{
    body: z.ZodObject<{
        email: z.ZodString;
        password: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        email: string;
        password: string;
    }, {
        email: string;
        password: string;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        email: string;
        password: string;
    };
}, {
    body: {
        email: string;
        password: string;
    };
}>;
export declare const refreshTokenSchema: z.ZodObject<{
    body: z.ZodObject<{
        refreshToken: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        refreshToken: string;
    }, {
        refreshToken: string;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        refreshToken: string;
    };
}, {
    body: {
        refreshToken: string;
    };
}>;
export declare const deviceCreateSchema: z.ZodObject<{
    body: z.ZodObject<{
        kategori: z.ZodString;
        merek: z.ZodString;
        tipe: z.ZodString;
        tahun_rilis: z.ZodNumber;
        estimated_weight_grams: z.ZodNumber;
        components: z.ZodArray<z.ZodObject<{
            nama_komponen: z.ZodString;
            kondisi: z.ZodEnum<["baik", "rusak_ringan", "rusak_berat", "mati"]>;
        }, "strip", z.ZodTypeAny, {
            nama_komponen: string;
            kondisi: "baik" | "rusak_ringan" | "rusak_berat" | "mati";
        }, {
            nama_komponen: string;
            kondisi: "baik" | "rusak_ringan" | "rusak_berat" | "mati";
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        kategori: string;
        merek: string;
        tipe: string;
        tahun_rilis: number;
        estimated_weight_grams: number;
        components: {
            nama_komponen: string;
            kondisi: "baik" | "rusak_ringan" | "rusak_berat" | "mati";
        }[];
    }, {
        kategori: string;
        merek: string;
        tipe: string;
        tahun_rilis: number;
        estimated_weight_grams: number;
        components: {
            nama_komponen: string;
            kondisi: "baik" | "rusak_ringan" | "rusak_berat" | "mati";
        }[];
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        kategori: string;
        merek: string;
        tipe: string;
        tahun_rilis: number;
        estimated_weight_grams: number;
        components: {
            nama_komponen: string;
            kondisi: "baik" | "rusak_ringan" | "rusak_berat" | "mati";
        }[];
    };
}, {
    body: {
        kategori: string;
        merek: string;
        tipe: string;
        tahun_rilis: number;
        estimated_weight_grams: number;
        components: {
            nama_komponen: string;
            kondisi: "baik" | "rusak_ringan" | "rusak_berat" | "mati";
        }[];
    };
}>;
export declare const transactionCreateSchema: z.ZodObject<{
    body: z.ZodObject<{
        device_id: z.ZodString;
        partner_id: z.ZodString;
        jalur: z.ZodEnum<["buyback", "recycle"]>;
    }, "strip", z.ZodTypeAny, {
        device_id: string;
        partner_id: string;
        jalur: "buyback" | "recycle";
    }, {
        device_id: string;
        partner_id: string;
        jalur: "buyback" | "recycle";
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        device_id: string;
        partner_id: string;
        jalur: "buyback" | "recycle";
    };
}, {
    body: {
        device_id: string;
        partner_id: string;
        jalur: "buyback" | "recycle";
    };
}>;
export declare const technicianOfferSchema: z.ZodObject<{
    body: z.ZodObject<{
        harga_tawar: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        harga_tawar: number;
    }, {
        harga_tawar: number;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        harga_tawar: number;
    };
}, {
    body: {
        harga_tawar: number;
    };
}>;
export declare const verificationSchema: z.ZodObject<{
    body: z.ZodObject<{
        verified_weight_grams: z.ZodNumber;
        verification_notes: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        verified_weight_grams: number;
        verification_notes?: string | undefined;
    }, {
        verified_weight_grams: number;
        verification_notes?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        verified_weight_grams: number;
        verification_notes?: string | undefined;
    };
}, {
    body: {
        verified_weight_grams: number;
        verification_notes?: string | undefined;
    };
}>;
export declare const completeBuybackSchema: z.ZodObject<{
    body: z.ZodObject<{
        harga_final: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        harga_final: number;
    }, {
        harga_final: number;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        harga_final: number;
    };
}, {
    body: {
        harga_final: number;
    };
}>;
export declare const dropOffPointCreateSchema: z.ZodObject<{
    body: z.ZodObject<{
        nama_lokasi: z.ZodString;
        latitude: z.ZodNumber;
        longitude: z.ZodNumber;
        tipe: z.ZodEnum<["repair_shop", "recycling_center"]>;
    }, "strip", z.ZodTypeAny, {
        tipe: "repair_shop" | "recycling_center";
        nama_lokasi: string;
        latitude: number;
        longitude: number;
    }, {
        tipe: "repair_shop" | "recycling_center";
        nama_lokasi: string;
        latitude: number;
        longitude: number;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        tipe: "repair_shop" | "recycling_center";
        nama_lokasi: string;
        latitude: number;
        longitude: number;
    };
}, {
    body: {
        tipe: "repair_shop" | "recycling_center";
        nama_lokasi: string;
        latitude: number;
        longitude: number;
    };
}>;
export declare const dropOffPointQuerySchema: z.ZodObject<{
    query: z.ZodObject<{
        tipe: z.ZodOptional<z.ZodEnum<["repair_shop", "recycling_center"]>>;
        partner_id: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        tipe?: "repair_shop" | "recycling_center" | undefined;
        partner_id?: string | undefined;
    }, {
        tipe?: "repair_shop" | "recycling_center" | undefined;
        partner_id?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        tipe?: "repair_shop" | "recycling_center" | undefined;
        partner_id?: string | undefined;
    };
}, {
    query: {
        tipe?: "repair_shop" | "recycling_center" | undefined;
        partner_id?: string | undefined;
    };
}>;
export declare const idParamSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        id: string;
    };
}, {
    params: {
        id: string;
    };
}>;
//# sourceMappingURL=schemas.d.ts.map