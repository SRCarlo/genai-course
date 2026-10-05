# RBAC

The Day 114 model is:

```text
User -> Role -> Permissions
```

Roles:

- owner
- admin
- member
- viewer

The application checks permissions such as `use_ai`, `manage_users`, and `manage_billing` rather than scattering user-ID checks throughout routes.
