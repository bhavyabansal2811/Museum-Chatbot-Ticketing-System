import os
from pathlib import Path

# Load environment variables from a .env file if present (simple fallback)
env_path = Path(__file__).resolve().parents[1] / '.env'
if env_path.is_file():
    # Very simple parser – split on '=' and ignore comments/blank lines
    with open(env_path) as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith('#'):
                continue
            if '=' in line:
                key, val = line.split('=', 1)
                os.environ.setdefault(key.strip(), val.strip())

# Expose configuration values
DB_PATH = os.getenv('DB_PATH', str(Path(__file__).resolve().parents[1] / 'data' / 'tickets.db'))
