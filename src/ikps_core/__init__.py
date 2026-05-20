"""IKPS-CORE: Dynamic Semantic Field Theory"""

__version__ = "2.1.0"
__author__ = "Samir Baladi"
__license__ = "MIT"

# استيراد المكونات الرئيسية إذا كانت موجودة
try:
    from .dsft_td_v2 import DSFTTDV2
except ImportError:
    pass
