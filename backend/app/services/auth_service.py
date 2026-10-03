import base64
import hashlib
import hmac
import os
from datetime import datetime, timedelta, timezone

import jwt
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.models import User


JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_MINUTES = 60 * 24


def hash_password(password: str) -> str:
    """
    Hash a password using Python's built-in scrypt implementation.
    """

    salt = os.urandom(16)

    password_hash = hashlib.scrypt(
        password.encode("utf-8"),
        salt=salt,
        n=2**14,
        r=8,
        p=1,
        dklen=32,
    )

    encoded_salt = base64.urlsafe_b64encode(salt).decode("ascii")
    encoded_hash = base64.urlsafe_b64encode(password_hash).decode(
        "ascii"
    )

    return f"scrypt${encoded_salt}${encoded_hash}"


def verify_password(
    password: str,
    stored_hash: str,
) -> bool:
    """
    Verify a password against a stored scrypt hash.
    """

    try:
        algorithm, encoded_salt, encoded_hash = stored_hash.split(
            "$",
            2,
        )

        if algorithm != "scrypt":
            return False

        salt = base64.urlsafe_b64decode(
            encoded_salt.encode("ascii")
        )

        expected_hash = base64.urlsafe_b64decode(
            encoded_hash.encode("ascii")
        )

        actual_hash = hashlib.scrypt(
            password.encode("utf-8"),
            salt=salt,
            n=2**14,
            r=8,
            p=1,
            dklen=len(expected_hash),
        )

        return hmac.compare_digest(
            actual_hash,
            expected_hash,
        )

    except (ValueError, TypeError):
        return False


def create_access_token(
    user_id: int,
    secret_key: str,
) -> str:
    """
    Create a signed JWT containing the user's ID.
    """

    now = datetime.now(timezone.utc)

    payload = {
        "sub": str(user_id),
        "iat": now,
        "exp": now
        + timedelta(minutes=JWT_EXPIRATION_MINUTES),
    }

    return jwt.encode(
        payload,
        secret_key,
        algorithm=JWT_ALGORITHM,
    )


def decode_access_token(
    token: str,
    secret_key: str,
) -> int | None:
    """
    Decode a JWT and return the user ID.
    """

    try:
        payload = jwt.decode(
            token,
            secret_key,
            algorithms=[JWT_ALGORITHM],
        )

        subject = payload.get("sub")

        if subject is None:
            return None

        return int(subject)

    except (
        jwt.InvalidTokenError,
        ValueError,
        TypeError,
    ):
        return None


def find_user_by_email(
    db: Session,
    email: str,
) -> User | None:
    """
    Find a user by normalized email address.
    """

    normalized_email = email.strip().lower()

    return db.scalar(
        select(User).where(
            User.email == normalized_email
        )
    )


def find_user_by_id(
    db: Session,
    user_id: int,
) -> User | None:
    """
    Find a user by database ID.
    """

    return db.get(User, user_id)