## 4. Other Requirements

### 4.1 System Constraints

- The implementation shall follow standard web technologies and the current project stack, including HTML5, CSS3, JavaScript, React, TypeScript, Vite, Tailwind CSS, and REST-based backend integration.
- The overall platform shall preserve clear domain separation across IAM, Product, Inventory, Order, Delivery, Payment, Promotion, Voucher, Loyalty, Shift, and Dashboard services.

### 4.2 Assumptions and Dependencies

- It is assumed that end users access the platform through modern browsers such as Google Chrome, Mozilla Firefox, Microsoft Edge, or Safari, with JavaScript, cookies, and local storage enabled.
- It is assumed that the organization will provide valid internal employee data, franchise-role mappings, and customer master data required for authentication, authorization, and operational workflows.
- The frontend depends on backend APIs exposed through a configurable base URL and requires those services to be available for authentication, product, inventory, order, delivery, payment, promotion, voucher, loyalty, and dashboard functions.
- The system depends on secure session handling through backend-issued cookies and token refresh support for uninterrupted user sessions.
- Media upload features depend on an external image storage service such as Cloudinary or an equivalent managed asset platform.
- Online payment features, including QR-based payment, depend on the availability of the configured payment provider and related banking channels; cash-based payment remains a fallback business flow where applicable.
- Stable internet connectivity is assumed between client devices, the frontend host, backend services, and any configured third-party integrations.

### 4.3 Future Enhancements

- Future releases may extend the platform with a progressive web app or dedicated mobile applications for iOS and Android.
- The system may be enhanced with richer analytics and reporting, including sales trends, customer behavior, franchise performance, inventory forecasting, and staff workload analysis.
- Additional IAM capabilities may be introduced, such as multi-factor authentication, single sign-on, finer-grained audit review, and stronger privileged-access controls.
- Notification features may be expanded to include email, SMS, or push updates for order progress, payment events, low-stock alerts, and shift assignments.
- Advanced operational capabilities may be added in later iterations, such as supplier management, demand forecasting, automated restock suggestions, and cross-franchise performance benchmarking.

### 4.4 Legal and Regulatory Considerations

- User profiles, orders, payments, inventory changes, and audit-related activity shall be stored securely and retained only for the period required by operational, financial, legal, or audit policies.
- The platform shall follow industry-standard practices for protecting confidentiality, integrity, and availability of business and personal data.
- Personal data processing shall comply with applicable privacy and data protection requirements, including GDPR, CCPA, and relevant local regulations where the system is operated.
- The system shall support data minimization, controlled access, traceable administrative actions, and appropriate deletion or anonymization processes when retention periods expire.
- Third-party services used for media hosting, payment processing, or analytics shall be selected and configured in accordance with organizational security and compliance requirements.

## 5. Non-functional Requirements

### 5.1 Reliability

- The system shall operate consistently with minimal functional errors across login, profile management, menu browsing, cart operations, checkout, order tracking, inventory updates, and administrative workflows.
- Core business actions shall include validation, clear error feedback, and retry-safe behavior to reduce the risk of duplicate submissions or inconsistent records.
- Session recovery shall be supported through automatic token refresh when permitted by the backend authentication model.
- After critical state changes such as checkout, payment confirmation, refund, delivery progress, or inventory adjustment, the user interface shall refresh authoritative backend data to avoid stale or misleading information.

### 5.2 Scalability

- The system architecture shall support horizontal and vertical scaling as the number of users, franchises, products, orders, and operational transactions increases.
- The platform shall support growth in concurrent customer sessions, staff operations, inventory updates, and reporting requests during peak periods.
- Caching, CDN delivery, and efficient API pagination/filtering shall be used to preserve responsiveness as data volume grows.

### 5.3 Supportability

- The system shall provide clear and up-to-date technical documentation covering setup, environment configuration, API usage, deployment, and troubleshooting.
- Error states presented to users and support teams shall be actionable and sufficiently descriptive to accelerate diagnosis.
- Operational support shall be aided by centralized logging, audit trails, and monitoring for authentication failures, payment issues, order-state errors, and service outages.
- Configuration shall be externalized so that different environments can be supported without code changes.

### 5.4 Performance

- Primary customer-facing pages and key administrative routes shall render an initial usable interface within 3 seconds under normal broadband conditions after application assets are cached.
- Standard API-backed actions such as login, profile retrieval, menu loading, cart retrieval, dashboard summary loading, and order lookup shall complete within 2 to 3 seconds under normal operating conditions.
- Client-side interactions that do not require a network round trip, such as navigation between loaded routes, filtering, or opening dialogs, shall feel immediate to users.
- The system shall provide visible loading and progress feedback for long-running operations such as checkout, payment confirmation, delivery updates, or large data retrieval.
- Large datasets shall be handled through pagination, scoped queries, or lazy loading to maintain responsive tables and dashboards.

### 5.5 Security and Privacy

- All communication between the browser, frontend host, backend APIs, and third-party providers shall use HTTPS/TLS.
- Sensitive business and personal data shall be encrypted at rest by the responsible backend or storage service and protected in transit using industry-standard encryption.
- Authentication and authorization shall enforce role-based and franchise-scoped access control for administrative operations.
- Session handling shall use secure cookies or equivalently secure token mechanisms, together with logout, refresh-token, password-reset, and verification flows.
- The authentication architecture shall be extensible to support multi-factor authentication for privileged roles in future releases.
- Critical actions such as login, role switching, order-state changes, payment confirmation or refund, and inventory adjustments shall be auditable.
- The frontend shall not store raw payment credentials and shall rely on approved payment providers for payment execution and status handling.

### 5.6 Compatibility

- The system shall support current major desktop browsers, including recent versions of Chrome, Firefox, Edge, and Safari.
- The user interface shall remain responsive across desktop, tablet, and mobile screen sizes.
- New modules, APIs, or integrations shall preserve backward compatibility with existing route structures and service contracts whenever practical.
- Deployment configuration shall remain compatible with static hosting environments that require SPA route rewrites.

### 5.7 Maintainability

- The codebase shall remain modular, with clear separation between API services, hooks, stores, routes, pages, shared components, and type definitions.
- TypeScript typing, linting, and consistent naming conventions shall be applied to reduce regressions and improve long-term maintainability.
- Changes in backend contracts shall be isolated to API/service mapping layers as much as possible instead of scattering transformation logic across the UI.
- Version control, release notes, and configuration management shall be applied consistently across the project lifecycle.
- Each service area shall be accompanied by sufficient API documentation, deployment notes, and configuration instructions to support safe maintenance and extension.
