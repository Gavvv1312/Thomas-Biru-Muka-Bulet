--
-- PostgreSQL database dump
--

\restrict qfaLMG0lkhXpQMakn8R2jza1GIpTGzWnG8DhGKECISDbUwuqNtjcpnv8m5DgyQQ

-- Dumped from database version 18.6
-- Dumped by pg_dump version 18.6

-- Started on 2026-09-22 14:39:33

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 862 (class 1247 OID 16400)
-- Name: ComponentCondition; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ComponentCondition" AS ENUM (
    'baik',
    'rusak_ringan',
    'rusak_berat',
    'mati'
);


ALTER TYPE public."ComponentCondition" OWNER TO postgres;

--
-- TOC entry 877 (class 1247 OID 16442)
-- Name: DropOffType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."DropOffType" AS ENUM (
    'repair_shop',
    'recycling_center'
);


ALTER TYPE public."DropOffType" OWNER TO postgres;

--
-- TOC entry 874 (class 1247 OID 16434)
-- Name: PaymentStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."PaymentStatus" AS ENUM (
    'unpaid',
    'pending',
    'paid'
);


ALTER TYPE public."PaymentStatus" OWNER TO postgres;

--
-- TOC entry 868 (class 1247 OID 16416)
-- Name: TransactionChannel; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."TransactionChannel" AS ENUM (
    'buyback',
    'recycle'
);


ALTER TYPE public."TransactionChannel" OWNER TO postgres;

--
-- TOC entry 871 (class 1247 OID 16422)
-- Name: TransactionStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."TransactionStatus" AS ENUM (
    'diajukan',
    'ditawar',
    'diverifikasi',
    'selesai',
    'dibatalkan'
);


ALTER TYPE public."TransactionStatus" OWNER TO postgres;

--
-- TOC entry 859 (class 1247 OID 16390)
-- Name: UserRole; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."UserRole" AS ENUM (
    'owner',
    'teknisi',
    'recycler',
    'admin'
);


ALTER TYPE public."UserRole" OWNER TO postgres;

--
-- TOC entry 865 (class 1247 OID 16410)
-- Name: ValuationChannel; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ValuationChannel" AS ENUM (
    'buyback',
    'recycle'
);


ALTER TYPE public."ValuationChannel" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 221 (class 1259 OID 16482)
-- Name: device_components; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.device_components (
    id text NOT NULL,
    "deviceId" text NOT NULL,
    "namaKomponen" text NOT NULL,
    kondisi public."ComponentCondition" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.device_components OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16465)
-- Name: devices; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.devices (
    id text NOT NULL,
    "userId" text NOT NULL,
    kategori text NOT NULL,
    merek text NOT NULL,
    tipe text NOT NULL,
    "tahunRilis" integer NOT NULL,
    "estimatedWeightGrams" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.devices OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 16531)
-- Name: dropoff_points; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.dropoff_points (
    id text NOT NULL,
    "namaLokasi" text NOT NULL,
    latitude double precision NOT NULL,
    longitude double precision NOT NULL,
    tipe public."DropOffType" NOT NULL,
    "partnerId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.dropoff_points OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16547)
-- Name: points_transactions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.points_transactions (
    id text NOT NULL,
    "userId" text NOT NULL,
    amount integer NOT NULL,
    source text NOT NULL,
    "referenceId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.points_transactions OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 16560)
-- Name: refresh_tokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.refresh_tokens (
    id text NOT NULL,
    "userId" text NOT NULL,
    "tokenHash" text NOT NULL,
    "expiresAt" timestamp(3) without time zone NOT NULL,
    "revokedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.refresh_tokens OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16512)
-- Name: transactions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transactions (
    id text NOT NULL,
    "deviceId" text NOT NULL,
    "userId" text NOT NULL,
    "partnerId" text NOT NULL,
    jalur public."TransactionChannel" NOT NULL,
    status public."TransactionStatus" DEFAULT 'diajukan'::public."TransactionStatus" NOT NULL,
    "hargaTawar" double precision,
    "hargaFinal" double precision,
    "paymentStatus" public."PaymentStatus" DEFAULT 'unpaid'::public."PaymentStatus" NOT NULL,
    "verifiedWeightGrams" integer,
    "verificationNotes" text,
    "certificateData" jsonb,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "completedAt" timestamp(3) without time zone
);


ALTER TABLE public.transactions OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16447)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id text NOT NULL,
    nama text NOT NULL,
    email text NOT NULL,
    "passwordHash" text NOT NULL,
    role public."UserRole" DEFAULT 'owner'::public."UserRole" NOT NULL,
    "poinHijau" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 16496)
-- Name: valuations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.valuations (
    id text NOT NULL,
    "deviceId" text NOT NULL,
    "estimasiNilaiMin" double precision NOT NULL,
    "estimasiNilaiMax" double precision NOT NULL,
    "jalurRekomendasi" public."ValuationChannel" NOT NULL,
    breakdown jsonb NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.valuations OWNER TO postgres;

--
-- TOC entry 5093 (class 0 OID 16482)
-- Dependencies: 221
-- Data for Name: device_components; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.device_components (id, "deviceId", "namaKomponen", kondisi, "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 5092 (class 0 OID 16465)
-- Dependencies: 220
-- Data for Name: devices; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.devices (id, "userId", kategori, merek, tipe, "tahunRilis", "estimatedWeightGrams", "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 5096 (class 0 OID 16531)
-- Dependencies: 224
-- Data for Name: dropoff_points; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.dropoff_points (id, "namaLokasi", latitude, longitude, tipe, "partnerId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 5097 (class 0 OID 16547)
-- Dependencies: 225
-- Data for Name: points_transactions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.points_transactions (id, "userId", amount, source, "referenceId", "createdAt") FROM stdin;
\.


--
-- TOC entry 5098 (class 0 OID 16560)
-- Dependencies: 226
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.refresh_tokens (id, "userId", "tokenHash", "expiresAt", "revokedAt", "createdAt") FROM stdin;
\.


--
-- TOC entry 5095 (class 0 OID 16512)
-- Dependencies: 223
-- Data for Name: transactions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.transactions (id, "deviceId", "userId", "partnerId", jalur, status, "hargaTawar", "hargaFinal", "paymentStatus", "verifiedWeightGrams", "verificationNotes", "certificateData", "createdAt", "updatedAt", "completedAt") FROM stdin;
\.


--
-- TOC entry 5091 (class 0 OID 16447)
-- Dependencies: 219
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, nama, email, "passwordHash", role, "poinHijau", "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 5094 (class 0 OID 16496)
-- Dependencies: 222
-- Data for Name: valuations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.valuations (id, "deviceId", "estimasiNilaiMin", "estimasiNilaiMax", "jalurRekomendasi", breakdown, "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 4922 (class 2606 OID 16495)
-- Name: device_components device_components_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.device_components
    ADD CONSTRAINT device_components_pkey PRIMARY KEY (id);


--
-- TOC entry 4920 (class 2606 OID 16481)
-- Name: devices devices_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.devices
    ADD CONSTRAINT devices_pkey PRIMARY KEY (id);


--
-- TOC entry 4929 (class 2606 OID 16546)
-- Name: dropoff_points dropoff_points_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dropoff_points
    ADD CONSTRAINT dropoff_points_pkey PRIMARY KEY (id);


--
-- TOC entry 4931 (class 2606 OID 16559)
-- Name: points_transactions points_transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.points_transactions
    ADD CONSTRAINT points_transactions_pkey PRIMARY KEY (id);


--
-- TOC entry 4933 (class 2606 OID 16572)
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- TOC entry 4927 (class 2606 OID 16530)
-- Name: transactions transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_pkey PRIMARY KEY (id);


--
-- TOC entry 4918 (class 2606 OID 16464)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4925 (class 2606 OID 16511)
-- Name: valuations valuations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.valuations
    ADD CONSTRAINT valuations_pkey PRIMARY KEY (id);


--
-- TOC entry 4934 (class 1259 OID 16575)
-- Name: refresh_tokens_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "refresh_tokens_userId_idx" ON public.refresh_tokens USING btree ("userId");


--
-- TOC entry 4916 (class 1259 OID 16573)
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- TOC entry 4923 (class 1259 OID 16574)
-- Name: valuations_deviceId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "valuations_deviceId_key" ON public.valuations USING btree ("deviceId");


--
-- TOC entry 4936 (class 2606 OID 16581)
-- Name: device_components device_components_deviceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.device_components
    ADD CONSTRAINT "device_components_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES public.devices(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4935 (class 2606 OID 16576)
-- Name: devices devices_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.devices
    ADD CONSTRAINT "devices_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4941 (class 2606 OID 16606)
-- Name: dropoff_points dropoff_points_partnerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dropoff_points
    ADD CONSTRAINT "dropoff_points_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4942 (class 2606 OID 16611)
-- Name: points_transactions points_transactions_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.points_transactions
    ADD CONSTRAINT "points_transactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4943 (class 2606 OID 16616)
-- Name: refresh_tokens refresh_tokens_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT "refresh_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4938 (class 2606 OID 16591)
-- Name: transactions transactions_deviceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT "transactions_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES public.devices(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4939 (class 2606 OID 16601)
-- Name: transactions transactions_partnerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT "transactions_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4940 (class 2606 OID 16596)
-- Name: transactions transactions_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT "transactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4937 (class 2606 OID 16586)
-- Name: valuations valuations_deviceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.valuations
    ADD CONSTRAINT "valuations_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES public.devices(id) ON UPDATE CASCADE ON DELETE CASCADE;


-- Completed on 2026-09-22 14:39:34

--
-- PostgreSQL database dump complete
--

\unrestrict qfaLMG0lkhXpQMakn8R2jza1GIpTGzWnG8DhGKECISDbUwuqNtjcpnv8m5DgyQQ

