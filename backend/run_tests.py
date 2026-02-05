import sys
import os
import pytest

# Add current directory to path
sys.path.append(os.getcwd())

# Set env vars for tests if not present
if "DATABASE_URL" not in os.environ:
    os.environ["DATABASE_URL"] = "sqlite:///test.db"
if "BETTER_AUTH_SECRET" not in os.environ:
    os.environ["BETTER_AUTH_SECRET"] = "test_secret"

if __name__ == "__main__":
    sys.exit(pytest.main(["tests/integration/test_auth.py"]))
