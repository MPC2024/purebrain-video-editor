"""
Brand Kits for PureBrain Video Editor

Pre-configured brand color schemes and typography settings for:
- TDHPS (The Dog House Pet Salon)
- MPC (My Pet Credentials)
- PawOps
"""

BRAND_KITS = {
    "tdhps": {
        "name": "The Dog House Pet Salon",
        "primary_color": "#965B83",          # TDHPS pink
        "accent_color": "#CC3366",           # Hot pink
        "text_color": "#FFFFFF",             # White
        "bg_color": "#1A1A1A",               # Dark gray
        "font_heading": "default",           # Will use system fallback
        "font_body": "default",
        "logo_path": None,
        "default_caption_style": "classic",
    },

    "mpc": {
        "name": "My Pet Credentials",
        "primary_color": "#F5A623",          # Orange
        "accent_color": "#D4891C",           # Dark orange
        "text_color": "#FFFFFF",             # White
        "bg_color": "#1A1A1A",               # Dark gray
        "font_heading": "default",
        "font_body": "default",
        "logo_path": None,
        "default_caption_style": "bold_pop",
    },

    "pawops": {
        "name": "PawOps",
        "primary_color": "#D4A574",          # Tan/beige
        "accent_color": "#FFBB58",           # Gold
        "text_color": "#FFFFFF",             # White
        "bg_color": "#000000",               # Pure black
        "font_heading": "default",
        "font_body": "default",
        "logo_path": None,
        "default_caption_style": "lower_third",
    },

    "default": {
        "name": "Default",
        "primary_color": "#965B83",          # Fallback to TDHPS
        "accent_color": "#CC3366",
        "text_color": "#FFFFFF",
        "bg_color": "#000000",
        "font_heading": "default",
        "font_body": "default",
        "logo_path": None,
        "default_caption_style": "classic",
    },
}

def get_brand_kit(brand_name: str = "tdhps") -> dict:
    """
    Get a brand kit by name.

    Args:
        brand_name: Key in BRAND_KITS (tdhps, mpc, pawops, default)

    Returns:
        Brand kit dictionary with colors, fonts, and styling defaults
    """
    return BRAND_KITS.get(brand_name.lower(), BRAND_KITS["default"])

def list_brands() -> list:
    """Return list of available brand names."""
    return list(BRAND_KITS.keys())
