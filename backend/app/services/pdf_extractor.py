from io import BytesIO

from pypdf import PdfReader


class PDFExtractionError(Exception):
    """Raised when PDF text extraction fails."""


def extract_text_from_pdf(file_bytes: bytes) -> str:
    """
    Extract text from a PDF stored in memory.

    The PDF is not written to permanent storage.
    """

    if not file_bytes:
        raise PDFExtractionError("The uploaded PDF is empty.")

    try:
        reader = PdfReader(BytesIO(file_bytes))

        pages_text = []

        for page in reader.pages:
            text = page.extract_text() or ""

            if text.strip():
                pages_text.append(text.strip())

        extracted_text = "\n\n".join(pages_text).strip()

        if not extracted_text:
            raise PDFExtractionError(
                "No readable text was found in the PDF."
            )

        return extracted_text

    except PDFExtractionError:
        raise

    except Exception as exc:
        raise PDFExtractionError(
            f"Unable to extract text from the PDF: {exc}"
        ) from exc