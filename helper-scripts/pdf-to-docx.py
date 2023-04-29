from argparse import ArgumentParser
from pdf2docx import Converter

argument_parser = ArgumentParser()

argument_parser.add_argument("input", help="Input PDF file to convert")
argument_parser.add_argument("output", help="Output DOCX file to save")

arguments = argument_parser.parse_args()

input_path = arguments.input
output_path = arguments.output

def convert_pdf2docx(input_path: str, output_path: str):
    converter = Converter(input_path)

    converter.convert(output_path)
    converter.close()

convert_pdf2docx(input_path, output_path)