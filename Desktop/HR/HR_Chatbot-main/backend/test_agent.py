# test_agent.py
import os
from agent import HRAgent  # Assuming your agent is in agent.py
from dotenv import load_dotenv


def test_hr_agent(
    google_api_key: str,
    vacations_file: str,
    tickets_file: str,
    test_queries: list,
):
    """Tests the HR agent with a set of queries.

    Args:
        google_api_key: Google API key.
        vacations_file: Path to the vacations CSV file.
        tickets_file: Path to the tickets CSV file.
        test_queries: A list of test queries.
    """
    try:
        agent = HRAgent(
            google_api_key=google_api_key,
            vacations_file=vacations_file,
            tickets_file=tickets_file,
        )

        results = {}
        for query in test_queries:
            print(f"\nQuery: {query}")
            response = agent.process_query(query, employee_id="1001")  # Replace with a test employee ID
            print(f"Response: {response}")
            results[query] = response

        return results

    except Exception as e:
        print(f"Error during testing: {str(e)}")
        return {}

if __name__ == "__main__":
    load_dotenv()
    UPLOAD_FOLDER = 'data/documents'
    ALLOWED_EXTENSIONS = {'pdf', 'docx', 'doc', 'txt'} 
    GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
    VACATIONS_FILE = "data/vacations.csv"
    TICKETS_FILE = "data/tickets.csv"

    TEST_QUERIES = [
        "ما هي شروط العمل عن بعد؟",
        "هل يمكنني العمل عن بعد بشكل دائم؟",
        "ما هي إجراءات طلب العمل عن بعد؟",
        "هل يجب علي توفير التجهيزات الخاصة بي للعمل عن بعد؟",
        "كيف يتم تقييم الموظفين الذين يعملون عن بعد؟",
        "ما هي سياسة الشركة بشأن أمن المعلومات أثناء العمل عن بعد؟",
        "هل يوجد تدريب على العمل عن بعد؟",
        "كيف يمكنني الحصول على الدعم الفني إذا واجهت مشاكل أثناء العمل عن بعد؟",
        "هل يمكنني العمل عن بعد من خارج البلاد؟",
        "ما هي مدة الإجازة السنوية؟",
    ]

    test_results = test_hr_agent(
        GOOGLE_API_KEY, VACATIONS_FILE, TICKETS_FILE, TEST_QUERIES
    )

    # You can add further processing or analysis of the test_results dictionary here
    # For example, save the results to a file or calculate metrics

    # Print the results in a structured way for analysis:
    print("\n\n----- Test Results -----")
    for query, response in test_results.items():
        print(f"\nQuery: {query}")
        print(f"Response: {response}")